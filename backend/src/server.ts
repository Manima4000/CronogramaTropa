import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './infra/http/middlewares/errorHandler';
import routes from './infra/http/routes';
import { connectDatabase } from './infra/database/prisma/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', routes);

// Error Handler (deve ser o último middleware)
app.use(errorHandler);

// Iniciar servidor
const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
