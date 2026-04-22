
import React from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Logo } from '@/src/components/ui/Logo';
import { useAuth } from '../context/AuthContext';
import { registerSchema, RegisterData } from '@/src/features/auth/types';
import { ArrowRight, User, Mail, Lock, Phone, MapPin, CalendarHeart, Globe } from 'lucide-react';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register: authRegister, error: authError } = useAuth();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
    });

    // Helper to Capitalize Words
    const capitalize = (str: string) => str.replace(/\b\w/g, l => l.toUpperCase());

    // Generate Days and Months for Selectors
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const onSubmit = async (data: RegisterData) => {
        try {
            await authRegister(data);
            if (redirect) {
                navigate(redirect);
            } else {
                navigate('/customer/dashboard');
            }
        } catch (err) {
            console.error('Registration failed', err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            {/* FX */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-pink/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative z-10">
                <div className="p-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex justify-between items-center">
                    <Logo className="h-8" withText={true} />
                    <Link to={`/login${redirect ? `?redirect=${redirect}` : ''}`} className="text-sm text-brand-gray hover:text-white">Já tenho conta</Link>
                </div>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Criar Conta</h2>
                    <p className="text-brand-gray text-sm mb-8">Cadastre-se para acompanhar seus pedidos e facilitar compras futuras.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-brand-gray uppercase mb-2 flex items-center gap-2"><User size={12} /> Nome Completo *</label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    className={`w-full bg-slate-950 border ${errors.name ? 'border-red-500' : 'border-slate-800'} rounded-xl py-3 px-4 text-white focus:border-brand-blue outline-none capitalize`}
                                    onBlur={(e) => setValue('name', capitalize(e.target.value))}
                                />
                                {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name.message}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-gray uppercase mb-2 flex items-center gap-2"><Mail size={12} /> Email *</label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    className={`w-full bg-slate-950 border ${errors.email ? 'border-red-500' : 'border-slate-800'} rounded-xl py-3 px-4 text-white focus:border-brand-blue outline-none`}
                                />
                                {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-gray uppercase mb-2 flex items-center gap-2"><Lock size={12} /> Senha *</label>
                                <input
                                    {...register('password')}
                                    type="password"
                                    className={`w-full bg-slate-950 border ${errors.password ? 'border-red-500' : 'border-slate-800'} rounded-xl py-3 px-4 text-white focus:border-brand-blue outline-none`}
                                />
                                {errors.password && <p className="text-red-500 text-[10px] mt-1">{errors.password.message}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-gray uppercase mb-2 flex items-center gap-2"><Lock size={12} /> Confirmar Senha *</label>
                                <input
                                    {...register('confirmPassword')}
                                    type="password"
                                    className={`w-full bg-slate-950 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-800'} rounded-xl py-3 px-4 text-white focus:border-brand-blue outline-none`}
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        {authError && <p className="text-red-400 text-sm bg-red-900/10 p-3 rounded border border-red-900/30">{authError}</p>}

                        <div className="flex justify-end gap-4 items-center pt-4">
                            <Link to="/" className="text-slate-500 hover:text-white text-sm font-bold">Cancelar</Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-brand-blue/20 flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Criando...' : 'Criar Conta'} <ArrowRight size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
