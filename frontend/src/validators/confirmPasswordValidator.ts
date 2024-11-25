import { z } from 'zod';

export const confirmPasswordValidator = (password: string) => z.string().min(6, "Confirm Password must match the password.")
  .refine(val => val === password, {
    message: "Passwords do not match.",
  });
