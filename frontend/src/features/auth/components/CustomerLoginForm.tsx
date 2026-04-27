import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { loginSchema, LoginCredentials } from '@/src/features/auth/types';
import { useAuth } from '../context/AuthContext';

interface Props {
    onSuccess: () => void;
    onForgotPassword: () => void;
}

export const CustomerLoginForm: React.FC<Props> = ({ onSuccess, onForgotPassword }) => {
    const { login, error: authError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginCredentials>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginCredentials) => {
        try {
            await login(data);
            onSuccess();
        } catch (err) {
            console.error('Login failed', err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-brand-gray uppercase mb-2">Email</label>
                    <input
                        {...register('email')}
                        type="email"
                        className={`w-full bg-slate-950 border ${errors.email ? 'border-red-500' : 'border-slate-800'} rounded-xl py-3 px-4 text-white text-sm focus:border-brand-blue outline-none transition-colors`}
                        placeholder="seu@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold text-brand-gray uppercase mb-2">Senha</label>
                    <div className="relative">
                        <input
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                            className={`w-full bg-slate-950 border ${errors.password ? 'border-red-500' : 'border-slate-800'} rounded-xl py-3 px-4 pr-12 text-white text-sm focus:border-brand-blue outline-none transition-colors`}
                            placeholder="********"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-brand-blue transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-[10px] mt-1">{errors.password.message}</p>}

                    <div className="flex justify-end mt-2">
                        <button
                            type="button"
                            onClick={onForgotPassword}
                            className="text-xs text-slate-500 hover:text-brand-blue transition-colors font-medium"
                        >
                            Esqueci minha senha
                        </button>
                    </div>
                </div>
            </div>

            {authError && <p className="text-red-400 text-xs text-center">{authError}</p>}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Entrando...' : 'Entrar'} <ArrowRight size={20} />
            </button>
        </form>
    );
};
