
import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Logo } from '@/src/components/ui/Logo';
import { useAuth } from '../context/AuthContext';
import { registerSchema, RegisterData } from '@/src/features/auth/types';
import { ArrowRight, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register: authRegister, error: authError } = useAuth();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
    });

    const capitalize = (str: string) => str.replace(/\b\w/g, l => l.toUpperCase());

    const onSubmit = async (data: RegisterData) => {
        try {
            console.log("Submitting registration...", data);
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
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
            {/* Background Glow FX (Sutil) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-pink/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-[2rem] shadow-xl overflow-hidden relative z-10">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 backdrop-blur flex justify-between items-center">
                    <Logo className="h-8" withText={true} />
                    <Link 
                        to={`/login${redirect ? `?redirect=${redirect}` : ''}`} 
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                    >
                        Já tenho conta
                    </Link>
                </div>

                <div className="p-8 md:p-12">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Criar Conta</h2>
                    <p className="text-slate-500 text-sm mb-10">Cadastre-se para acompanhar seus pedidos e facilitar compras futuras.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* NOME */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <User size={12} className="text-brand-blue" /> Nome Completo *
                                </label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    className={`w-full bg-slate-50 border ${errors.name ? 'border-red-500' : 'border-slate-200'} rounded-2xl py-4 px-5 text-slate-900 font-medium focus:border-brand-blue focus:bg-white outline-none transition-all capitalize shadow-sm`}
                                    onBlur={(e) => setValue('name', capitalize(e.target.value))}
                                    placeholder="Seu nome"
                                />
                                {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 px-1">{errors.name.message}</p>}
                            </div>

                            {/* EMAIL */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Mail size={12} className="text-brand-blue" /> Email *
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    className={`w-full bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-2xl py-4 px-5 text-slate-900 font-medium focus:border-brand-blue focus:bg-white outline-none transition-all shadow-sm`}
                                    placeholder="seu@email.com"
                                />
                                {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 px-1">{errors.email.message}</p>}
                            </div>

                            {/* SENHA */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Lock size={12} className="text-brand-blue" /> Senha *
                                </label>
                                <div className="relative">
                                    <input
                                        {...register('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        className={`w-full bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-2xl py-4 px-5 pr-12 text-slate-900 font-medium focus:border-brand-blue focus:bg-white outline-none transition-all shadow-sm`}
                                        placeholder="********"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-blue transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 px-1">{errors.password.message}</p>}
                            </div>

                            {/* CONFIRMAR SENHA */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Lock size={12} className="text-brand-blue" /> Confirmar Senha *
                                </label>
                                <div className="relative">
                                    <input
                                        {...register('confirmPassword')}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className={`w-full bg-slate-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200'} rounded-2xl py-4 px-5 pr-12 text-slate-900 font-medium focus:border-brand-blue focus:bg-white outline-none transition-all shadow-sm`}
                                        placeholder="********"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-blue transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold mt-1 px-1">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        {authError && <p className="text-red-600 text-sm bg-red-50 p-4 rounded-2xl border border-red-100 font-medium">{authError}</p>}

                        <div className="flex flex-col sm:flex-row justify-end gap-4 items-center pt-8 border-t border-slate-100">
                            <Link 
                                to="/" 
                                className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl text-sm font-black uppercase tracking-widest transition-all text-center"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto bg-brand-blue hover:bg-brand-blue/90 text-white font-black py-4 px-12 rounded-2xl shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all uppercase tracking-widest text-sm"
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
