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

// CORS com suporte a credentials (cookies)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

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
