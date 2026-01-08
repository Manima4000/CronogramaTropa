import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { errorHandler } from './infra/http/middlewares/errorHandler';
import routes from './infra/http/routes';
import { connectDatabase } from './infra/database/prisma/prisma';
import { setupSwagger } from './infra/http/swagger/swagger';

dotenv.config();

const app = express();
const PORT_BACKEND = process.env.PORT_BACKEND || 3333;

// Lista de origins permitidas
const getAllowedOrigins = (): string[] => {
  const origins: string[] = [];

  // Adiciona FRONTEND_URL se estiver definida
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }

  // Em desenvolvimento, permite localhost
  if (process.env.NODE_ENV !== 'production') {
    origins.push('http://localhost:5173');
    origins.push('http://localhost:3000');
  }

  return origins;
};

// Validação de origin para CORS
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();

    // Permite requisições sem origin (ex: Postman, curl, mobile apps)
    // Em produção, você pode querer desabilitar isso
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // Verifica se o origin está na lista de permitidos
    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permite envio de cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
  maxAge: 86400, // Cache preflight por 24h
};

// Aplicar CORS
app.use(cors(corsOptions));

// Log de segurança em produção
if (process.env.NODE_ENV === 'production') {
  if (!process.env.FRONTEND_URL) {
    console.error('⚠️  WARNING: FRONTEND_URL not set in production!');
  } else {
    console.log(`✅ CORS configured for: ${process.env.FRONTEND_URL}`);
  }
}

app.use(express.json());
app.use(cookieParser());

// Swagger Documentation
setupSwagger(app);

// Rotas
app.use('/api', routes);

// Error Handler (deve ser o último middleware)
app.use(errorHandler);

// Iniciar servidor
const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT_BACKEND, () => {
      console.log(`🚀 Server is running on port ${PORT_BACKEND}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
