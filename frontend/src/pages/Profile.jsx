import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Lock, AlignLeft } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-bg p-10 font-['Lexend']">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-brand-muted hover:text-brand-text font-bold mb-8 transition-colors">
          <ArrowLeft size={20} /> Voltar ao Painel
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-surface rounded-3xl border border-brand-border p-10 shadow-xl shadow-stone-900/5">
          <div className="flex items-center gap-6 mb-12 pb-8 border-b border-brand-border text-left">
            <div className="w-20 h-20 rounded-3xl bg-brand-primary flex items-center justify-center text-white text-2xl font-bold">KF</div>
            <div>
              <h2 className="text-2xl font-bold text-brand-text">Perfil do Usuário</h2>
              <p className="text-brand-muted font-medium">Adicione sua bio.</p>
            </div>
          </div>

          <form className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-brand-muted ml-1 flex items-center gap-2"><User size={14}/> Nome</label>
                <input type="text" defaultValue="Karen Felix" className="w-full px-5 py-4 rounded-2xl bg-brand-bg border border-brand-border outline-none focus:border-brand-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-brand-muted ml-1 flex items-center gap-2"><Mail size={14}/> E-mail</label>
                <input type="email" defaultValue="karen@exemplo.com" className="w-full px-5 py-4 rounded-2xl bg-brand-bg border border-brand-border outline-none focus:border-brand-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-brand-muted ml-1 flex items-center gap-2"><Lock size={14}/> Nova Senha</label>
              <input type="password" placeholder="••••••••" className="w-full px-5 py-4 rounded-2xl bg-brand-bg border border-brand-border outline-none focus:border-brand-primary" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-brand-muted ml-1 flex items-center gap-2"><AlignLeft size={14}/> Bio</label>
              <textarea rows="4" className="w-full px-5 py-4 rounded-2xl bg-brand-bg border border-brand-border outline-none resize-none" placeholder="Sua jornada literária..."></textarea>
            </div>

            <button type="submit" className="w-full bg-brand-primary text-white py-5 rounded-2xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2">
              <Save size={20} /> Atualizar Cadastro
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}