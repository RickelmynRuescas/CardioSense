import { useNavigate } from 'react-router-dom'
import { ChevronRight, ArrowDown, Activity, ArrowUp, Hand, HeartPulse } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { auth } from '../config/firebase'

export default function Welcome() {
  const navigate = useNavigate()
  const firstName = auth.currentUser?.displayName?.split(' ')[0] ?? 'usuário'

  return (
    <div className="min-h-svh flex flex-col bg-bg-primary pb-24">
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 text-center">

        {/* Logo */}
        <svg viewBox="0 0 100 90" className="w-40 h-40 logo-animated mt-8" fill="none">
          <path
            d="M50 80 C50 80 8 55 8 30 C8 16 18 8 30 8 C38 8 45 12 50 19 C55 12 62 8 70 8 C82 8 92 16 92 30 C92 55 50 80 50 80 Z"
            stroke="#00b4d8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 42 L28 42 L33 28 L40 54 L46 34 L51 46 L56 42 L82 42"
            stroke="#00b4d8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Saudação */}
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-1.5 text-white/40 text-base font-medium">
            <span>Olá, <span className="text-accent font-semibold">{firstName}</span></span>
            <Hand className="text-accent" size={16} />
          </p>
          <h1 className="text-2xl font-bold text-white leading-tight">
            Bem-vindo ao<br />
            <span className="text-accent">CardioSense</span>
          </h1>
        </div>

        {/* Frase motivacional */}
        <div className="bg-bg-card border border-white/10 rounded-2xl px-6 py-5 max-w-xs w-full">
          <p className="flex items-center gap-2 text-white/80 text-base font-medium leading-relaxed">
            Vamos fazer seu BPM hoje? <HeartPulse className="text-accent flex-shrink-0" size={18} />
          </p>
          <p className="text-white/30 text-xs mt-2 leading-relaxed">
            Monitorar sua frequência cardíaca regularmente é o primeiro passo para uma vida mais saudável.
          </p>
        </div>

        {/* Botão */}
        <button
          onClick={() => navigate('/health-profile')}
          className="w-full max-w-xs flex items-center justify-between bg-accent hover:bg-accent-dark text-white font-semibold rounded-2xl px-6 py-4 text-sm transition-all duration-200 shadow-[0_0_20px_rgba(0,180,216,0.3)] hover:shadow-[0_0_35px_rgba(0,180,216,0.5)] active:scale-95"
        >
          <span>Ir para o Cadastro</span>
          <ChevronRight size={18} />
        </button>

        {/* O que é BPM */}
        <div className="w-full max-w-xs flex flex-col gap-2 text-left border-t border-white/8 pt-4">
          <p className="text-xs font-semibold text-accent/70 uppercase tracking-widest">O que é BPM?</p>
          <p className="text-sm text-white/40 leading-relaxed">
            <span className="text-white/60 font-medium">BPM</span> significa <span className="text-white/60 font-medium">Batimentos Por Minuto</span> — é a unidade que mede quantas vezes o coração bate em 60 segundos.
          </p>
          <p className="text-sm text-white/40 leading-relaxed">
            Para adultos em repouso, a faixa considerada normal é de <span className="text-accent font-semibold">60 a 100 BPM</span>. Abaixo disso pode indicar bradicardia; acima, taquicardia.
          </p>
          <div className="flex gap-2.5 mt-1">
            <div className="flex-1 flex flex-col items-center gap-2 rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-500/10 to-transparent px-2 py-3.5 shadow-[0_0_15px_rgba(59,130,246,0.08)]">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/15">
                <ArrowDown className="text-blue-400" size={15} />
              </div>
              <p className="text-base font-bold text-white leading-none">&lt; 60</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400/80">Baixo</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 rounded-2xl border border-green-500/20 bg-gradient-to-b from-green-500/10 to-transparent px-2 py-3.5 shadow-[0_0_15px_rgba(34,197,94,0.08)]">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/15">
                <Activity className="text-green-400" size={15} />
              </div>
              <p className="text-base font-bold text-white leading-none">60–100</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-green-400/80">Normal</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-500/10 to-transparent px-2 py-3.5 shadow-[0_0_15px_rgba(239,68,68,0.08)]">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/15">
                <ArrowUp className="text-red-400" size={15} />
              </div>
              <p className="text-base font-bold text-white leading-none">&gt; 100</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-red-400/80">Alto</p>
            </div>
          </div>
        </div>

        {/* Importância do BPM */}
        <div className="w-full max-w-xs flex flex-col gap-2 text-left border-t border-white/8 pt-4">
          <p className="text-xs font-semibold text-accent/70 uppercase tracking-widest">Por que medir seu BPM?</p>
          <p className="text-sm text-white/40 leading-relaxed">
            A frequência cardíaca é um dos sinais vitais mais importantes do corpo. Valores fora da faixa normal podem indicar condições como <span className="text-white/60 font-medium">bradicardia</span> (batimentos lentos) ou <span className="text-white/60 font-medium">taquicardia</span> (batimentos acelerados), que exigem atenção médica.
          </p>
          <p className="text-sm text-white/40 leading-relaxed">
            Monitorar regularmente permite identificar alterações precocemente, acompanhar a evolução da sua saúde e agir antes que pequenos sinais se tornem problemas maiores.
          </p>
        </div>

        {/* Quem somos */}
        <div className="w-full max-w-xs flex flex-col gap-2 text-left border-t border-white/8 pt-4">
          <p className="text-xs font-semibold text-accent/70 uppercase tracking-widest">Quem somos</p>
          <p className="text-sm text-white/40 leading-relaxed">
            O <span className="text-white/60 font-medium">CardioSense</span> é uma plataforma de monitoramento cardiovascular preventivo. Utilizamos inteligência artificial para analisar sua frequência cardíaca e fatores de risco, oferecendo orientações personalizadas para incentivar hábitos mais saudáveis.
          </p>
          <p className="text-sm text-white/25 leading-relaxed mt-1">
            Não substituímos consultas médicas — somos uma ferramenta de apoio e conscientização.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
