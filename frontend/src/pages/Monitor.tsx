import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Minus, Plus, Info, X, Hand, HeartPulse, Watch, Smartphone, Lightbulb } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { analyzeHeartRate, type HealthProfile } from '../utils/heartAnalysis'
import { Heart as HeartIcon } from 'lucide-react'

export default function Monitor() {
  const navigate = useNavigate()
  const [bpm, setBpm] = useState(67)
  const [showTip, setShowTip] = useState(false)
  const [tipClosing, setTipClosing] = useState(false)

  function closeTip() {
    setTipClosing(true)
    setTimeout(() => { setShowTip(false); setTipClosing(false) }, 250)
  }

  const profile: HealthProfile | null = useMemo(() => {
    const stored = localStorage.getItem('healthProfile')
    return stored ? JSON.parse(stored) : null
  }, [])

  const { bpmStatus, riskLevel, normalMin, normalMax } = useMemo(
    () => analyzeHeartRate(bpm, profile),
    [bpm, profile]
  )

  const statusConfig = {
    baixa:         { label: 'Frequência Baixa',        color: 'text-blue-400',   ring: 'border-blue-400/40',   shadow: 'shadow-[0_0_60px_rgba(59,130,246,0.2)]' },
    normal:        { label: 'Frequência Normal',        color: 'text-green-400',  ring: 'border-green-400/40',  shadow: 'shadow-[0_0_60px_rgba(34,197,94,0.2)]' },
    elevada:       { label: 'Frequência Elevada',       color: 'text-yellow-400', ring: 'border-yellow-400/40', shadow: 'shadow-[0_0_60px_rgba(234,179,8,0.2)]' },
    muito_elevada: { label: 'Frequência Muito Elevada', color: 'text-red-400',    ring: 'border-red-400/40',    shadow: 'shadow-[0_0_60px_rgba(239,68,68,0.2)]' },
  }

  const riskBadge = {
    baixo:    { label: 'Baixo Risco',    color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/30' },
    moderado: { label: 'Risco Moderado', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
    alto:     { label: 'Alto Risco',     color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30' },
  }

  const current = statusConfig[bpmStatus]
  const badge   = riskBadge[riskLevel]

  function handleAnalyze() {
    navigate('/result', { state: { bpm, isNew: true } })
  }

  function clamp(v: number) {
    return Math.max(20, Math.min(250, v))
  }

  return (
    <div className="min-h-svh flex flex-col bg-bg-primary pb-24">
      {/* Header */}
      <div className="px-5 pt-10 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <HeartIcon size={20} className="text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">Monitor Cardíaco</h1>
            <p className="text-xs text-white/40 mt-0.5">Insira sua frequência cardíaca</p>
          </div>
        </div>
        <button
          onClick={() => setShowTip(v => !v)}
          className="w-9 h-9 rounded-full bg-bg-card border border-white/10 flex items-center justify-center text-white/40 hover:text-accent hover:border-accent/30 transition-all"
        >
          <Info size={17} />
        </button>
      </div>

      {/* Modal de dicas */}
      {showTip && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 pb-24">
          <div className={`w-full max-w-sm bg-bg-secondary border border-white/10 rounded-2xl p-5 shadow-xl max-h-[80svh] overflow-y-auto flex flex-col gap-4 ${tipClosing ? 'modal-exit' : 'modal-enter'}`}>

            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Como medir sua frequência</h2>
              <button onClick={closeTip} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Método 1 — pulso */}
            <div>
              <p className="flex items-center gap-1.5 text-xs text-accent font-semibold mb-1.5"><Hand size={14} /> Pelo pulso (punho)</p>
              <ol className="text-xs text-white/50 space-y-1 list-decimal list-inside leading-relaxed">
                <li>Sente-se e fique em repouso por 2 minutos</li>
                <li>Coloque 2 dedos na parte interna do pulso, abaixo do polegar</li>
                <li>Conte os batimentos durante 60 segundos</li>
                <li>Digite o valor encontrado abaixo</li>
              </ol>
            </div>

            {/* Método 2 — pescoço */}
            <div>
              <p className="flex items-center gap-1.5 text-xs text-accent font-semibold mb-1.5"><HeartPulse size={14} /> Pelo pescoço (carótida)</p>
              <ol className="text-xs text-white/50 space-y-1 list-decimal list-inside leading-relaxed">
                <li>Peça para alguém (ou use você mesmo) colocar o dedo indicador levemente na lateral do pescoço, ao lado da traqueia</li>
                <li>Sinta o pulso sem apertar forte</li>
                <li>Conte os batimentos por 60 segundos</li>
                <li>Digite o valor abaixo</li>
              </ol>
            </div>

            {/* Método 3 — dispositivos */}
            <div>
              <p className="flex items-center gap-1.5 text-xs text-accent font-semibold mb-1.5"><Watch size={14} /> Por dispositivos externos</p>
              <ul className="text-xs text-white/50 space-y-1 list-disc list-inside leading-relaxed">
                <li>Smartwatch ou relógio inteligente (Apple Watch, Galaxy Watch, etc.)</li>
                <li>Oxímetro de dedo — mede SpO₂ e BPM simultaneamente</li>
                <li>Monitor cardíaco de academia ou hospital</li>
              </ul>
            </div>

            {/* Método 4 — câmera do celular */}
            <div>
              <p className="flex items-center gap-1.5 text-xs text-accent font-semibold mb-1.5"><Smartphone size={14} /> Pela câmera do celular</p>
              <ol className="text-xs text-white/50 space-y-1 list-decimal list-inside leading-relaxed">
                <li>Abra apps como <span className="text-white/70">Cardiio</span>, <span className="text-white/70">Heart Rate Monitor</span> ou similar</li>
                <li>Cubra a câmera traseira com o dedo indicador</li>
                <li>Aguarde a leitura (leva cerca de 15 segundos)</li>
                <li>Digite o BPM exibido pelo app abaixo</li>
              </ol>
            </div>

            <p className="flex items-start gap-1.5 text-[10px] text-white/25 leading-relaxed border-t border-white/10 pt-2">
              <Lightbulb className="flex-shrink-0 mt-0.5" size={12} />
              <span>Para maior precisão, repouse por pelo menos 5 minutos antes de medir.</span>
            </p>

            <button
              onClick={closeTip}
              className="w-full py-3.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:border-white/20 transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-8">
        {/* BPM Display */}
        <div className="relative flex items-center justify-center">
          <div className={`w-52 h-52 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${current.ring} ${current.shadow}`}>
            <div className="w-44 h-44 rounded-full border border-white/5 flex flex-col items-center justify-center gap-1">
              <Heart
                size={28}
                className={`${current.color} animate-pulse transition-colors duration-500`}
                fill="currentColor"
                fillOpacity={0.3}
              />
              <span className="text-6xl font-bold text-white tracking-tight leading-none">
                {bpm}
              </span>
              <span className="text-sm text-white/40 font-medium">BPM</span>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex flex-col items-center gap-2">
          <span className={`text-sm font-semibold transition-colors duration-500 ${current.color}`}>
            {current.label}
          </span>
          <span className={`text-xs font-medium px-3 py-1 rounded-full border transition-all duration-500 ${badge.color} ${badge.bg}`}>
            {badge.label}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 w-full max-w-xs">
          <button
            onClick={() => setBpm(v => clamp(v - 1))}
            onMouseDown={() => {
              const interval = setInterval(() => setBpm(v => clamp(v - 1)), 80)
              const stop = () => { clearInterval(interval); window.removeEventListener('mouseup', stop) }
              window.addEventListener('mouseup', stop)
            }}
            className="w-14 h-14 rounded-full bg-bg-card border border-white/10 flex items-center justify-center text-white hover:border-accent/40 hover:text-accent transition-all active:scale-90"
          >
            <Minus size={22} />
          </button>

          <input
            type="number"
            value={bpm}
            onChange={e => setBpm(clamp(Number(e.target.value) || 0))}
            min={20}
            max={250}
            className="flex-1 bg-bg-card border border-white/10 rounded-xl text-center text-white text-2xl font-bold py-4 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          <button
            onClick={() => setBpm(v => clamp(v + 1))}
            onMouseDown={() => {
              const interval = setInterval(() => setBpm(v => clamp(v + 1)), 80)
              const stop = () => { clearInterval(interval); window.removeEventListener('mouseup', stop) }
              window.addEventListener('mouseup', stop)
            }}
            className="w-14 h-14 rounded-full bg-bg-card border border-white/10 flex items-center justify-center text-white hover:border-accent/40 hover:text-accent transition-all active:scale-90"
          >
            <Plus size={22} />
          </button>
        </div>

        {/* Reference bar dinâmica */}
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-white/30 mb-2">
            <span>Baixo</span>
            <span>Normal</span>
            <span>Alto</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden flex">
            <div className="flex-1 bg-blue-500/60" />
            <div className="flex-[2] bg-green-500/60" />
            <div className="flex-1 bg-red-500/60" />
          </div>
          <div className="flex justify-between text-xs text-white/20 mt-1">
            <span>&lt;{normalMin}</span>
            <span>{normalMin}–{normalMax}</span>
            <span>&gt;{normalMax}</span>
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="px-5 mb-4 max-w-sm w-full mx-auto">
        <button
          onClick={handleAnalyze}
          className="w-full bg-accent hover:bg-accent-dark text-white font-semibold rounded-2xl py-4 text-base transition-all duration-200 shadow-[0_0_25px_rgba(0,180,216,0.35)] hover:shadow-[0_0_40px_rgba(0,180,216,0.5)] active:scale-95"
        >
          Analisar Resultado
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
