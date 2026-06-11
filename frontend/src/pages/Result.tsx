import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { analyzeHeartRate, type HealthProfile } from '../utils/heartAnalysis'
import { Activity } from 'lucide-react'
import { api } from '../services/api'

const BPM_STATUS_LABEL: Record<string, string> = {
  baixa:        'Frequência Baixa — Possível Bradicardia',
  normal:       'Frequência Normal',
  elevada:      'Frequência Elevada',
  muito_elevada:'Frequência Muito Elevada',
}

const RISK_CONFIG = {
  baixo: {
    label: 'BAIXO RISCO',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    shadowColor: 'shadow-[0_0_30px_rgba(34,197,94,0.15)]',
    dot: 'bg-green-400',
    recommendations: [
      'Continue monitorando sua frequência regularmente',
      'Mantenha hábitos saudáveis de alimentação',
      'Pratique atividades físicas moderadas',
      'Evite tabagismo e consumo excessivo de álcool',
    ],
  },
  moderado: {
    label: 'RISCO MODERADO',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    shadowColor: 'shadow-[0_0_30px_rgba(234,179,8,0.15)]',
    dot: 'bg-yellow-400',
    recommendations: [
      'Consulte um médico para avaliação mais detalhada',
      'Monitore sua frequência cardíaca com mais frequência',
      'Controle os fatores de risco identificados',
      'Reduza o consumo de cafeína e estimulantes',
    ],
  },
  alto: {
    label: 'ALTO RISCO',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    shadowColor: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]',
    dot: 'bg-red-400',
    recommendations: [
      'Procure atendimento médico o quanto antes',
      'Evite esforços físicos e situações de estresse',
      'Em caso de dor no peito ou falta de ar, ligue 192 (SAMU)',
      'Monitore sua frequência continuamente',
    ],
  },
}

export default function Result() {
  const navigate = useNavigate()
  const location = useLocation()
  const bpm: number = location.state?.bpm ?? Number(localStorage.getItem('lastBpm') ?? 67)
  const savedRef = useRef(false)

  const stored = localStorage.getItem('healthProfile')
  const profile: HealthProfile | null = stored ? JSON.parse(stored) : null

  const { bpmStatus, riskLevel, riskCount, normalMin, normalMax } = analyzeHeartRate(bpm, profile)
  const config = RISK_CONFIG[riskLevel]

  useEffect(() => {
    localStorage.setItem('lastBpm', String(bpm))

    if (!location.state?.bpm || savedRef.current) return
    savedRef.current = true

    const measurement = {
      id: Date.now().toString(),
      bpm,
      bpmStatus,
      riskLevel,
      createdAt: new Date().toISOString(),
    }

    const existing = JSON.parse(localStorage.getItem('measurements') ?? '[]')
    const updated = [measurement, ...existing].slice(0, 100)
    localStorage.setItem('measurements', JSON.stringify(updated))

    api.measurements.save({ bpm, bpmStatus, riskLevel }).catch(() => {})
  }, [])

  return (
    <div className="min-h-svh flex flex-col bg-bg-primary pb-24">
      <div className="px-5 pt-10 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <Activity size={20} className="text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">Resultado da Análise</h1>
            <p className="text-xs text-white/40 mt-0.5">Avaliação cardiovascular</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-5 gap-5 max-w-sm w-full mx-auto">
        {/* BPM Card */}
        <div className={`rounded-2xl border p-6 flex flex-col items-center gap-3 ${config.bgColor} ${config.borderColor} ${config.shadowColor}`}>
          <span className="text-7xl font-bold text-white tracking-tight">{bpm}</span>
          <span className="text-base text-white/50 font-medium">Frequência Cardíaca • BPM</span>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${config.bgColor} ${config.borderColor}`}>
            <span className={`w-2 h-2 rounded-full ${config.dot}`} />
            <span className={`text-sm font-bold tracking-wider ${config.color}`}>{config.label}</span>
          </div>
        </div>

        {/* Status */}
        <div className="bg-bg-card border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-white/40 font-medium mb-1">Status cardiovascular</p>
          <p className="text-sm text-white/80 leading-relaxed">{BPM_STATUS_LABEL[bpmStatus]}</p>
          {riskCount > 0 && (
            <p className="text-xs text-white/40 mt-1">
              {riskCount} fator{riskCount > 1 ? 'es' : ''} de risco identificado{riskCount > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Reference range */}
        <div className="bg-bg-card border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-white/40 font-medium mb-3">Faixa de referência para sua idade</p>
          <div className="h-2 rounded-full overflow-hidden flex">
            <div className="w-[20%] bg-blue-500/50" />
            <div className="flex-1 bg-green-500/50" />
            <div className="w-[15%] bg-yellow-500/50" />
            <div className="w-[15%] bg-red-500/50" />
          </div>
          <div className="flex justify-between text-xs text-white/30 mt-1.5">
            <span>&lt;{normalMin}</span>
            <span>{normalMin}–{normalMax} BPM</span>
            <span>&gt;{normalMax + 20}</span>
          </div>
          <p className="text-xs text-white/30 mt-2">
            Sua medição: <span className={`font-semibold ${config.color}`}>{bpm} BPM</span>
          </p>
        </div>

        {/* Recommendations */}
        <div className="bg-bg-card border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-white/40 font-medium mb-3">Recomendações preventivas</p>
          <ul className="flex flex-col gap-3">
            {config.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] text-accent font-bold">{i + 1}</span>
                </div>
                <span className="text-sm text-white/70 leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* History button */}
        <button
          onClick={() => navigate('/history')}
          className="w-full flex items-center justify-between bg-accent/10 border border-accent/20 rounded-2xl px-5 py-4 text-accent hover:bg-accent/20 transition-all active:scale-95"
        >
          <span className="text-sm font-medium">Ver histórico completo</span>
          <ChevronRight size={18} />
        </button>

        <p className="text-xs text-white/20 text-center pb-2">
          CardioSense não realiza diagnósticos médicos. Consulte um profissional de saúde.
        </p>
      </div>

      <BottomNav />
    </div>
  )
}
