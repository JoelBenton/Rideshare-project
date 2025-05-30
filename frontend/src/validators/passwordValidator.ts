import { z } from 'zod';

export const passwordValidator = z.string().min(6, "Password must be at least 6 characters.");
