import { z } from 'zod';

export const emailValidator = z.string().email("Please enter a valid email address.");
