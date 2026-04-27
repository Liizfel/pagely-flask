import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, CheckCircle, Clock, XCircle, BarChart3, 
  Plus, Star, LogOut, X, Trophy, TrendingUp, MessageSquareQuote, Tag, Hash, Book
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

const THEME_OPTIONS = [
  { label: 'Romance' }, { label: 'Conto' }, { label: 'Crônica' },
  { label: 'Poesia Lírica' }, { label: 'Fábula' }, { label: 'Epopeia' }, { label: 'Drama' }
];

const THEME_DATA = [
  { name: 'Romance', lidos: 12 }, { name: 'Drama', lidos: 19 },
  { name: 'Conto', lidos: 7 }, { name: 'Crônica', lidos: 5 },
];

const WEEKLY_DATA = [
  { day: 'Seg', paginas: 45 }, { day: 'Ter', paginas: 52 }, { day: 'Qua', paginas: 38 },
  { day: 'Qui', paginas: 65 }, { day: 'Sex', paginas: 48 }, { day: 'Sab', paginas: 90 }, { day: 'Dom', paginas: 70 },
];

const STAR_RANKING = [
  { id: 1, title: 'Dom Casmurro', stars: 5, category: 'Romance' },
  { id: 2, title: 'A Moça Tecelã', stars: 4, category: 'Conto' },
  { id: 3, title: 'O Corvo', stars: 4, category: 'Poesia Lírica' },
];

const REVIEWS = [
  { id: 1, title: 'Dom Casmurro', stars: 5, theme: 'Romance', text: 'Uma obra-prima da ambiguidade humana.', date: '2 horas atrás' },
  { id: 2, title: 'Antígona', stars: 4, theme: 'Drama', text: 'O conflito entre as leis dos homens e as leis divinas é atemporal.', date: 'Ontem' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const userBio = "Ler enriquece a alma.";

  return (
    <div className="min-h-screen bg-brand-bg">
      <nav className="bg-brand-surface border-b border-brand-border sticky top-0 z-40 px-10 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brand-text tracking-tighter text-stone-800">Pagely</h1>
          
          <div className="flex items-center gap-8">
            <button className="text-sm font-bold text-brand-primary border-b-2 border-brand-primary pb-1">Dashboard</button>
            <div className="h-6 w-[1px] bg-brand-border" />
            
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/profile')}>
              <div className="text-right max-w-[200px]">
                <p className="text-sm font-bold text-brand-text group-hover:text-brand-primary transition-colors leading-none">Karen Felix</p>
                <p className="text-[11px] text-brand-muted font-medium italic my-1 line-clamp-1">{userBio}</p>
                <p className="text-[10px] text-brand-primary font-bold uppercase tracking-widest leading-none">Ver Perfil</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-base shadow-inner">KF</div>
            </div>

            <button onClick={() => navigate('/login')} className="text-stone-400 hover:text-rose-600 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="p-10 max-w-7xl mx-auto w-full">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-brand-text tracking-tight">Performance Literária</h2>
            <p className="text-brand-muted font-medium mt-1 text-lg">Seus hábitos literários detalhados.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10">
            <Plus size={20} /> Adicionar Livro
          </button>
        </header>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Lendo', val: '03', icon: BookOpen, color: 'bg-amber-50 text-amber-700' },
            { label: 'Lidos', val: '43', icon: CheckCircle, color: 'bg-stone-100 text-stone-800' },
            { label: 'Quero Ler', val: '12', icon: Clock, color: 'bg-stone-50 text-stone-500' },
            { label: 'Abandonado', val: '02', icon: XCircle, color: 'bg-rose-50 text-rose-600' }
          ].map((item) => (
            <div key={item.label} className="bg-brand-surface p-6 rounded-3xl border border-brand-border flex items-center gap-4 shadow-sm transition-transform hover:translate-y-[-2px]">
              <div className={`p-3 rounded-2xl ${item.color}`}><item.icon size={22} /></div>
              <div>
                <p className="text-2xl font-bold text-brand-text">{item.val}</p>
                <p className="text-[11px] font-bold text-brand-muted uppercase tracking-tight">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-brand-surface p-8 rounded-3xl border border-brand-border shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp size={20} className="text-brand-primary" />
              <h3 className="font-bold text-brand-text uppercase text-xs tracking-widest">Páginas lidas na semana</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WEEKLY_DATA}>
                  <defs>
                    <linearGradient id="colorPag" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#44403C" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#44403C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#A8A29E', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="paginas" stroke="#44403C" strokeWidth={3} fill="url(#colorPag)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-brand-surface p-8 rounded-3xl border border-brand-border shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <BarChart3 size={20} className="text-brand-primary" />
              <h3 className="font-bold text-brand-text uppercase text-xs tracking-widest">Gêneros Preferidos</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={THEME_DATA}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A8A29E', fontSize: 12}} />
                  <Bar dataKey="lidos" radius={[10, 10, 0, 0]} barSize={35}>
                    {THEME_DATA.map((entry, index) => (
                      <Cell key={index} fill={index === 1 ? '#44403C' : '#E7E5E4'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section: Ranking and Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-brand-surface p-8 rounded-3xl border border-brand-border shadow-sm h-fit">
            <div className="flex items-center gap-2 mb-8">
              <Trophy size={20} className="text-amber-600" />
              <h3 className="font-bold text-brand-text uppercase text-xs tracking-widest">Top Ranking</h3>
            </div>
            <div className="space-y-4">
              {STAR_RANKING.map((book) => (
                <div key={book.id} className="bg-brand-bg p-5 rounded-2xl border border-brand-border flex flex-col">
                  <div className="flex items-center gap-1.5 text-brand-muted mb-1">
                    <Tag size={10} />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">{book.category}</span>
                  </div>
                  <p className="font-bold text-brand-text text-sm">{book.title}</p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < book.stars ? "#D4A373" : "none"} color={i < book.stars ? "#D4A373" : "#D1D5DB"} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-brand-surface p-8 rounded-3xl border border-brand-border shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <MessageSquareQuote size={20} className="text-brand-primary" />
              <h3 className="font-bold text-brand-text uppercase text-xs tracking-widest">Diário de Resenhas</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {REVIEWS.map((review) => (
                <div key={review.id} className="bg-brand-bg p-6 rounded-2xl border border-brand-border flex flex-col h-full shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-brand-text text-sm leading-tight">{review.title}</p>
                      <span className="text-[9px] font-bold text-brand-primary uppercase mt-1 block">{review.theme}</span>
                    </div>
                    <div className="flex shrink-0 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill={i < review.stars ? "#44403C" : "none"} color={i < review.stars ? "#44403C" : "#D1D5DB"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-brand-muted leading-relaxed flex-1 italic">"{review.text}"</p>
                  <p className="text-[9px] font-bold text-brand-muted uppercase mt-4 tracking-wider">{review.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal: Add New Book */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-stone-900/40 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-brand-surface w-full max-w-xl rounded-[2.5rem] p-10 border border-brand-border shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-brand-text tracking-tight">Novo Registro</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-brand-bg rounded-full transition-colors"><X size={20}/></button>
                </div>
                
                <form className="space-y-6 text-left">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-brand-muted ml-1 flex items-center gap-2"><Book size={12}/> Título do Livro</label>
                    <input type="text" className="w-full px-5 py-4 rounded-2xl bg-brand-bg border border-brand-border outline-none focus:border-brand-primary transition-all shadow-sm" placeholder="Nome da obra" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Status Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-brand-muted ml-1 flex items-center gap-2"><CheckCircle size={12}/> Status</label>
                      <select className="w-full px-5 py-4 rounded-2xl bg-brand-bg border border-brand-border outline-none font-bold shadow-sm">
                        <option>Lendo</option>
                        <option>Lido</option>
                        <option>Quero Ler</option>
                        <option>Abandonado</option>
                      </select>
                    </div>
                    {/* Theme Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-brand-muted ml-1 flex items-center gap-2"><Tag size={12}/> Gênero (Tema)</label>
                      <select className="w-full px-5 py-4 rounded-2xl bg-brand-bg border border-brand-border outline-none font-bold shadow-sm">
                        <option disabled selected>Selecione um tema...</option>
                        {THEME_OPTIONS.map((opt) => (
                          <option key={opt.label} value={opt.label}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Page Count Inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-brand-muted ml-1 flex items-center gap-2"><Hash size={12}/> Total de Páginas</label>
                      <input type="number" className="w-full px-5 py-4 rounded-2xl bg-brand-bg border border-brand-border outline-none focus:border-brand-primary transition-all shadow-sm" placeholder="Ex: 320" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-brand-muted ml-1 flex items-center gap-2"><BookOpen size={12}/> Páginas Lidas</label>
                      <input type="number" className="w-full px-5 py-4 rounded-2xl bg-brand-bg border border-brand-border outline-none focus:border-brand-primary transition-all shadow-sm" placeholder="Ex: 45" />
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-brand-muted ml-1 flex justify-center">Sua Avaliação</label>
                    <div className="flex gap-3 justify-center py-4 bg-brand-bg rounded-2xl border border-brand-border shadow-sm">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} type="button" onClick={() => setRating(s)} className="transition-transform hover:scale-110">
                          <Star size={28} fill={s <= rating ? "#44403C" : "none"} color={s <= rating ? "#44403C" : "#D1D5DB"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Area */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-brand-muted ml-1 flex items-center gap-2"><MessageSquareQuote size={12}/> Resenha Crítica</label>
                    <textarea rows="4" className="w-full px-5 py-4 rounded-2xl bg-brand-bg border border-brand-border outline-none resize-none focus:border-brand-primary shadow-sm" placeholder="O que achou desta leitura?"></textarea>
                  </div>

                  {/* Submit Button */}
                  <button className="w-full bg-brand-primary text-white py-5 rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/20 active:scale-95">
                    Salvar na Estante
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}