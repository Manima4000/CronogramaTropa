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

    // Logs apenas em desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[CORS] Request from origin: ${origin || 'NO ORIGIN'}`);
      console.log(`[CORS] Allowed origins:`, allowedOrigins);
    }

    // Em produção, permitimos se estiver na lista ou se a requisição for do mesmo domínio
    if (!origin || allowedOrigins.includes(origin)) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[CORS] ✅ Allowing origin: ${origin || 'NO ORIGIN'}`);
      }
      return callback(null, true);
    }

    // Log de segurança sempre (para detectar tentativas de ataque)
    console.warn(`[SECURITY] 🚫 CORS blocked request from origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // Permite envio de cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Adiciona OPTIONS explicitamente
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
  exposedHeaders: ['Set-Cookie'], // Expõe cookies
  maxAge: 86400, // Cache preflight por 24h
  preflightContinue: false, // Não continua após preflight (deixa CORS lidar)
  optionsSuccessStatus: 204, // Status para OPTIONS
};

// Aplicar CORS
app.use(cors(corsOptions));

// Log de configuração no startup (apenas desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  console.log('\n🔧 Environment Configuration:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || 'not set'}`);
  console.log(`   PORT_BACKEND: ${PORT_BACKEND}`);
  console.log(`   Allowed Origins:`, getAllowedOrigins());
}

// Log de segurança em produção (apenas avisos críticos)
if (process.env.NODE_ENV === 'production') {
  if (!process.env.FRONTEND_URL) {
    console.error('⚠️  CRITICAL: FRONTEND_URL not set in production!');
    process.exit(1); // Não inicia o servidor sem essa configuração
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error('⚠️  CRITICAL: JWT_SECRET not set or too weak!');
    process.exit(1);
  }
  console.log('✅ Production server starting with secure configuration');
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
