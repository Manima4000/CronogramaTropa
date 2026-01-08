import rateLimit from 'express-rate-limit';

// Rate limiter para login (proteção contra brute force)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo de 5 tentativas por IP
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Conta todas as requisições
});

// Rate limiter para registro (proteção contra spam)
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Máximo de 3 registros por IP
  message: 'Muitas tentativas de registro. Tente novamente em 1 hora.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter geral para APIs (proteção contra DDoS)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo de 100 requisições por IP
  message: 'Muitas requisições. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Em desenvolvimento, não aplica rate limiting
    return process.env.NODE_ENV !== 'production';
  },
});

// Rate limiter estrito para operações sensíveis (sync, delete, etc)
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo de 10 requisições por IP
  message: 'Muitas requisições para operações sensíveis. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Em desenvolvimento, não aplica rate limiting
    return process.env.NODE_ENV !== 'production';
  },
});
