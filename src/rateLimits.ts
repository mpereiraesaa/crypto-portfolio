import rateLimit from 'express-rate-limit';

export const BASE_LIMITS = rateLimit({
    windowMs: Number(process.env.BASE_WINDOW) || 1000,
    max: Number(process.env.BASE_WINDOW_MAX) || 5
});
  
export const TRANSACTION_LIMITS = rateLimit({
    windowMs: Number(process.env.TRANSACTION_WINDOW) || 1000,
    max: Number(process.env.TRANSACTION_WINDOW_MAX) || 2
});
