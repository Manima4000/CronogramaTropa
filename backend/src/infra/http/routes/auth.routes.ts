import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { PrismaUserRepository } from '../../database/prisma/repositories/PrismaUserRepository';
import { AuthenticateUserUseCase } from '../../../domains/user/usecases/AuthenticateUserUseCase';
import { RegisterUserUseCase } from '../../../domains/user/usecases/RegisterUserUseCase';
import { GetUserByIdUseCase } from '../../../domains/user/usecases/GetUserByIdUseCase';
import { BcryptHashProvider } from '../../providers/auth/BcryptHashProvider';
import { JWTProvider } from '../../providers/auth/JWTProvider';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { loginLimiter, registerLimiter } from '../middlewares/rateLimiter';

const authRoutes = Router();

// Manual Dependency Injection (Inversão de Dependência - SOLID)
const userRepository = new PrismaUserRepository();
const hashProvider = new BcryptHashProvider();
const jwtProvider = new JWTProvider();

const authenticateUserUseCase = new AuthenticateUserUseCase(
  userRepository,
  hashProvider,
  jwtProvider
);

const registerUserUseCase = new RegisterUserUseCase(
  userRepository,
  hashProvider
);

const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);

const authController = new AuthController(
  authenticateUserUseCase,
  registerUserUseCase,
  getUserByIdUseCase
);

// Rotas públicas

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Authenticates user and sets httpOnly cookie with JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [admin, user]
 *       401:
 *         description: Invalid credentials
 */
authRoutes.post('/login', loginLimiter, (req, res, next) => authController.login(req, res, next));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User logout
 *     description: Clears authentication cookie
 *     responses:
 *       204:
 *         description: Logout successful
 */
authRoutes.post('/logout', (req, res, next) => authController.logout(req, res, next));

// Rotas protegidas (requerem autenticação)

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current user
 *     description: Returns authenticated user information
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User information
 *       401:
 *         description: Not authenticated
 */
authRoutes.get('/me', authenticate, (req, res, next) => authController.me(req, res, next));

// Rotas admin-only

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register new user (Admin only)
 *     description: Creates a new user account. Only accessible by admins.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 default: user
 *     responses:
 *       201:
 *         description: User created successfully
 *       403:
 *         description: Insufficient permissions
 *       409:
 *         description: Email already in use
 */
authRoutes.post(
  '/register',
  registerLimiter,
  authenticate,
  authorize('admin'),
  (req, res, next) => authController.register(req, res, next)
);

export default authRoutes;
