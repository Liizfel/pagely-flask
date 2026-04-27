import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-brand-bg">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-surface w-full max-w-md p-10 rounded-3xl shadow-xl shadow-stone-900/5 border border-brand-border"
      >
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-brand-text">Pagely</h1>
          <p className="text-brand-muted mt-2 text-sm">Crie seu acervo de leitura.</p>
        </div>

        <form className="space-y-5" onSubmit={handleRegister}>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-brand-text ml-1">Nome</label>
            <input required type="text" className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary outline-none transition-all" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-brand-text ml-1">E-mail</label>
            <input required type="email" className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary outline-none transition-all" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-brand-text ml-1">Senha</label>
            <input required type="password" className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary outline-none transition-all" />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold hover:bg-stone-800 transition-all mt-4 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? 'Cadastrando...' : 'Finalizar'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-brand-muted">
          Já tem conta? <Link to="/login" className="text-brand-text font-bold hover:underline">Entrar</Link>
        </p>
      </motion.div>
    </div>
  );
}