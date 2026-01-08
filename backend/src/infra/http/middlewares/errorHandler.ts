import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/errors/AppError';

export const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  // Log detalhado apenas em desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', error);
    console.error('Stack:', error.stack);
  } else {
    // Em produção, log sem stack trace (apenas mensagem para segurança)
    console.error(`[ERROR] ${error.message}`);
  }

  // Em produção, nunca expor detalhes internos do erro
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
