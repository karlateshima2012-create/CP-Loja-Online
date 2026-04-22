import React from 'react';
import { ArrowRight, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
    onSuccess: () => void;
}

export const AdminLoginForm: React.FC<Props> = ({ onSuccess }) => {
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            await login({ email: 'admin@creativeprint.jp', password: 'admin-password' });
            onSuccess();
        } catch (err) {
            console.error('Login failed', err);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-brand-blue/10 border border-brand-blue/20 p-4 rounded-xl">
                <h3 className="font-bold text-brand-blue text-sm mb-1">Acesso Administrativo</h3>
                <p className="text-xs text-brand-gray">Controle total sobre produtos, pedidos, parceiros e pagamentos.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-brand-gray uppercase mb-2">Email</label>
                    <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        <input
                            type="email"
                            value="admin@creativeprint.jp"
                            readOnly
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-brand-gray text-sm focus:outline-none cursor-not-allowed"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-brand-gray uppercase mb-2">Senha</label>
                    <div className="relative">
                        <input
                            type="password"
                            value="********"
                            readOnly
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-brand-gray text-sm focus:outline-none cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={handleLogin}
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2"
            >
                Entrar no Painel <ArrowRight size={20} />
            </button>
        </div>
    );
};
