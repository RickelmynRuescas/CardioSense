import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, X } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import BottomNav from '../components/BottomNav'
import { api } from '../services/api'
import { History as HistoryIcon } from 'lucide-react'

type Period = 'diario' | 'semanal' | 'mensal'

interface Measurement {
  id: string
  bpm: number
  bpmStatus: string
  riskLevel: string
  createdAt: string
}

function statusConfig(riskLevel: string) {
  if (riskLevel === 'baixo')    return { label: 'Normal',  color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' }
  if (riskLevel === 'moderado') return { label: 'Moderado', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' }
  return { label: 'Alto', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' }
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('pt-BR'),
    time: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    label: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
  }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-secondary border border-white/10 rounded-xl px-3 py-2 shadow-xl">
        <p className="text-xs text-white/40 mb-0.5">{label}</p>
        <p className="text-sm font-bold text-accent">{payload[0].value} BPM</p>
      </div>
    )
  }
  return null
}

export default function History() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<Period>('semanal')
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [clearing, setClearing] = useState(false)

  useEffect(() => {
    const local: Measurement[] = JSON.parse(localStorage.getItem('measurements') ?? '[]')
    if (local.length > 0) {
      setMeasurements(local)
      setLoading(false)
    }

    api.measurements.list()
      .then(data => {
        if (data.length > 0) setMeasurements(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleClearAll() {
    setClearing(true)
    localStorage.removeItem('measurements')
    localStorage.removeItem('lastBpm')
    setMeasurements([])
    api.measurements.deleteAll().catch(() => {})
    setClearing(false)
    setShowConfirm(false)
  }

  function filterByPeriod(data: Measurement[]) {
    const now = new Date()
    return data.filter(m => {
      const d = new Date(m.createdAt)
      const diffMs = now.getTime() - d.getTime()
      const diffDays = diffMs / (1000 * 60 * 60 * 24)
      if (period === 'diario')  return diffDays <= 1
      if (period === 'semanal') return diffDays <= 7
      return diffDays <= 30
    })
  }

  const filtered = filterByPeriod(measurements)

  function chartLabel(iso: string): string {
    const d = new Date(iso)
    if (period === 'diario')  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    if (period === 'semanal') return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    return d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
  }

  const chartData = [...filtered]
    .reverse()
    .map(m => ({ time: chartLabel(m.createdAt), bpm: m.bpm }))

  return (
    <div className="min-h-svh flex flex-col bg-bg-primary pb-24">
      {/* Header */}
      <div className="px-5 pt-10 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <HistoryIcon size={20} className="text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">Histórico</h1>
            <p className="text-xs text-white/40 mt-0.5">Frequência Cardíaca (BPM)</p>
          </div>
        </div>
        {measurements.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all"
          >
            <Trash2 size={14} />
            Limpar
          </button>
        )}
      </div>

      {/* Period tabs */}
      <div className="px-5 mb-4">
        <div className="flex gap-1 bg-bg-card border border-white/10 rounded-xl p-1">
          {(['diario', 'semanal', 'mensal'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                period === p
                  ? 'bg-accent text-white shadow-[0_0_10px_rgba(0,180,216,0.3)]'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-5 mb-6">
        <div className="bg-bg-card border border-white/10 rounded-2xl p-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[40, 140]} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={100} stroke="rgba(239,68,68,0.3)" strokeDasharray="4 4" />
                <ReferenceLine y={60}  stroke="rgba(59,130,246,0.3)" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="bpm" stroke="#00b4d8" strokeWidth={2.5}
                  dot={{ fill: '#00b4d8', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: '#00b4d8', stroke: 'rgba(0,180,216,0.3)', strokeWidth: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center">
              <p className="text-xs text-white/30">Nenhum dado neste período</p>
            </div>
          )}
        </div>
      </div>

      {/* Records */}
      <div className="px-5 flex-1">
        <p className="text-xs text-white/40 font-medium mb-3">Últimos registros</p>

        {loading && (
          <p className="text-xs text-white/30 text-center py-6">Carregando...</p>
        )}

        {!loading && measurements.length === 0 && (
          <p className="text-xs text-white/30 text-center py-6">Nenhuma medição registrada ainda.</p>
        )}

        <div className="flex flex-col gap-3">
          {filtered.map(m => {
            const cfg = statusConfig(m.riskLevel)
            const { date, time } = formatDate(m.createdAt)
            return (
              <button
                key={m.id}
                onClick={() => navigate('/result', { state: { bpm: m.bpm } })}
                className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between hover:border-white/20 transition-all active:scale-[0.99]"
              >
                <div className="text-left">
                  <p className="text-xs text-white/40">{date} — {time}</p>
                  <p className="text-lg font-bold text-white mt-0.5">{m.bpm} <span className="text-xs font-normal text-white/40">BPM</span></p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${cfg.color} ${cfg.bg}`}>
                  {cfg.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <BottomNav />

      {/* Modal de confirmação */}
      {showConfirm && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 pb-6">
          <div className="w-full max-w-sm bg-bg-secondary border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Apagar histórico</h2>
              <button onClick={() => setShowConfirm(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-white/50 mb-5 leading-relaxed">
              Todos os registros serão apagados permanentemente, inclusive do banco de dados. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:border-white/20 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearAll}
                disabled={clearing}
                className="flex-1 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
              >
                {clearing ? 'Apagando...' : 'Apagar tudo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
