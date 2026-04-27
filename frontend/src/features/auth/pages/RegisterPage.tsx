
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
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            <Starfield />
            
            {/* ATMOSPHERIC GLOWS (NEBULOSAS) */}
            <div className="absolute top-0 -left-[10%] w-[600px] h-[600px] bg-brand-blue/15 rounded-full blur-[150px] animate-pulse"></div>
            <div className="absolute bottom-0 -right-[10%] w-[600px] h-[600px] bg-brand-pink/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-2xl border border-brand-blue/20 rounded-[2.5rem] shadow-[0_0_50px_rgba(56,182,255,0.1)] overflow-hidden relative z-10 animate-fade-in-up">
                <div className="p-8 border-b border-white/5 bg-white/5 backdrop-blur-md flex justify-between items-center">
                    <Logo className="h-8" withText={true} />
                    <Link 
                        to={`/login${redirect ? `?redirect=${redirect}` : ''}`} 
                        className="px-6 py-2.5 bg-brand-blue/10 border border-brand-blue/40 text-brand-blue hover:bg-brand-blue hover:text-slate-950 rounded-xl text-[10px] font-black transition-all uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(56,182,255,0.1)]"
                    >
                        Já tenho conta
                    </Link>
                </div>

                <div className="p-8 md:p-12">
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Criar Conta</h2>
                        <div className="w-20 h-1 bg-brand-blue rounded-full mb-4 shadow-[0_0_10px_rgba(56,182,255,0.5)]"></div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Cadastre-se para acompanhar seus pedidos.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* NOME */}
                            <div className="space-y-2 group">
                                <label className="block text-[10px] font-black text-brand-blue uppercase tracking-widest flex items-center gap-2 opacity-70 group-focus-within:opacity-100 transition-opacity">
                                    <User size={12} /> Nome Completo *
                                </label>
                                <div className="relative">
                                    <input
                                        {...register('name')}
                                        type="text"
                                        className={`w-full bg-slate-950/50 border ${errors.name ? 'border-red-500' : 'border-brand-blue/30'} rounded-2xl py-4 px-5 text-white font-medium focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all capitalize shadow-[0_0_20px_rgba(56,182,255,0.05)]`}
                                        onBlur={(e) => setValue('name', capitalize(e.target.value))}
                                        placeholder="EX: KARLA TESHIMA"
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase tracking-tighter">{errors.name.message}</p>}
                            </div>

                            {/* EMAIL */}
                            <div className="space-y-2 group">
                                <label className="block text-[10px] font-black text-brand-blue uppercase tracking-widest flex items-center gap-2 opacity-70 group-focus-within:opacity-100 transition-opacity">
                                    <Mail size={12} /> Email *
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    className={`w-full bg-slate-950/50 border ${errors.email ? 'border-red-500' : 'border-brand-blue/30'} rounded-2xl py-4 px-5 text-white font-medium focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all shadow-[0_0_20px_rgba(56,182,255,0.05)]`}
                                    placeholder="SEU@EMAIL.COM"
                                />
                                {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase tracking-tighter">{errors.email.message}</p>}
                            </div>

                            {/* SENHA */}
                            <div className="space-y-2 group">
                                <label className="block text-[10px] font-black text-brand-blue uppercase tracking-widest flex items-center gap-2 opacity-70 group-focus-within:opacity-100 transition-opacity">
                                    <Lock size={12} /> Senha *
                                </label>
                                <div className="relative">
                                    <input
                                        {...register('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        className={`w-full bg-slate-950/50 border ${errors.password ? 'border-red-500' : 'border-brand-blue/30'} rounded-2xl py-4 px-5 pr-12 text-white font-medium focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all shadow-[0_0_20px_rgba(56,182,255,0.05)]`}
                                        placeholder="********"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-brand-blue transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase tracking-tighter">{errors.password.message}</p>}
                            </div>

                            {/* CONFIRMAR SENHA */}
                            <div className="space-y-2 group">
                                <label className="block text-[10px] font-black text-brand-blue uppercase tracking-widest flex items-center gap-2 opacity-70 group-focus-within:opacity-100 transition-opacity">
                                    <Lock size={12} /> Confirmar Senha *
                                </label>
                                <div className="relative">
                                    <input
                                        {...register('confirmPassword')}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className={`w-full bg-slate-950/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-brand-blue/30'} rounded-2xl py-4 px-5 pr-12 text-white font-medium focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all shadow-[0_0_20px_rgba(56,182,255,0.05)]`}
                                        placeholder="********"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-brand-blue transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase tracking-tighter">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        {authError && <p className="text-red-400 text-sm bg-red-900/10 p-4 rounded-2xl border border-red-900/30 font-bold uppercase tracking-tighter">{authError}</p>}

                        <div className="flex flex-col sm:flex-row justify-end gap-4 items-center pt-8 border-t border-white/5">
                            <Link 
                                to="/" 
                                className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all text-center"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto bg-brand-blue hover:bg-brand-blue/90 text-slate-950 font-black py-4 px-12 rounded-2xl shadow-[0_0_25px_rgba(56,182,255,0.4)] flex items-center justify-center gap-3 disabled:opacity-50 transition-all uppercase tracking-[0.2em] text-sm group"
                            >
                                {isSubmitting ? 'Processando...' : 'Criar Conta'} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
