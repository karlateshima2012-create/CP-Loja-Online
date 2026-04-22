import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

export type RegisterData = z.infer<typeof registerSchema>;

import { UserRole } from '@/src/types';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    tenant_id?: string; // Multi-tenancy
}
