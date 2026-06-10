import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string()
    .regex(/^03[0-9]{9}$/, "Phone number must be a valid Pakistani number (03XXXXXXXXX)"),
  address: z.string().optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
