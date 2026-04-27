import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
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
          <p className="text-brand-muted mt-2 text-sm">"A leitura engrandece a alma. - Voltaire"</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-brand-text ml-1">Usuário</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary outline-none transition-all placeholder-stone-400" 
              placeholder="Digite seu acesso"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-brand-text ml-1">Senha</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary outline-none transition-all placeholder-stone-400" 
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold hover:bg-stone-800 transition-all mt-4 active:scale-[0.98]">
            Acessar
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-brand-muted">
          Novo por aqui? <Link to="/register" className="text-brand-text font-bold hover:underline">Criar conta</Link>
        </p>
      </motion.div>
    </div>
  );
}