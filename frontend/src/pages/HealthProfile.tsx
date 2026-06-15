import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ClipboardList, AlertTriangle } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { api } from '../services/api'

type YesNo = 'sim' | 'nao' | null

interface HealthData {
  age: string
  sex: string
  weight: string
  height: string
  hypertension: YesNo
  diabetes: YesNo
  cardiacHistory: YesNo
  medications: YesNo
  familyHistory: YesNo
}

function YesNoToggle({
  value,
  onChange,
}: {
  value: YesNo
  onChange: (v: YesNo) => void
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange(value === 'sim' ? null : 'sim')}
        className={`flex-1 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          value === 'sim'
            ? 'bg-accent text-white shadow-[0_0_12px_rgba(0,180,216,0.35)]'
            : 'bg-bg-primary border border-white/10 text-white/50 hover:border-white/20'
        }`}
      >
        Sim
      </button>
      <button
        type="button"
        onClick={() => onChange(value === 'nao' ? null : 'nao')}
        className={`flex-1 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          value === 'nao'
            ? 'bg-bg-card border border-white/20 text-white'
            : 'bg-bg-primary border border-white/10 text-white/50 hover:border-white/20'
        }`}
      >
        Não
      </button>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-accent/70 uppercase tracking-widest mt-2 mb-1">
      {children}
    </p>
  )
}

export default function HealthProfile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<HealthData>({
    age: '',
    sex: '',
    weight: '',
    height: '',
    hypertension: null,
    diabetes: null,
    cardiacHistory: null,
    medications: null,
    familyHistory: null,
  })

  function set<K extends keyof HealthData>(key: K, value: HealthData[K]) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.profile.save(data)
      localStorage.setItem('healthProfile', JSON.stringify(data))
    } catch {
      localStorage.setItem('healthProfile', JSON.stringify(data))
    } finally {
      setLoading(false)
      navigate('/monitor')
    }
  }

  return (
    <div className="min-h-svh flex flex-col bg-bg-primary pb-24">
      <div className="px-5 pt-10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <ClipboardList size={20} className="text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">Cadastro de Saúde</h1>
            <p className="text-xs text-white/40 mt-0.5">Preencha seus dados para uma análise precisa</p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-5 py-6 gap-5 max-w-sm w-full mx-auto pb-10">

        {/* Dados pessoais */}
        <SectionLabel>Dados pessoais</SectionLabel>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/50">Idade</label>
          <input
            type="number"
            placeholder="Ex: 35"
            value={data.age}
            onChange={e => set('age', e.target.value)}
            min={1}
            max={120}
            required
            className="bg-bg-card border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/25 text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/50">Sexo</label>
          <div className="relative">
            <select
              value={data.sex}
              onChange={e => set('sex', e.target.value)}
              required
              className="w-full appearance-none bg-bg-card border border-white/10 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all text-white/70 cursor-pointer"
            >
              <option value="" disabled>Selecione</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" size={16} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/50">Peso (kg)</label>
          <input
            type="number"
            placeholder="Ex: 70"
            value={data.weight}
            onChange={e => set('weight', e.target.value)}
            min={1}
            required
            className="bg-bg-card border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/25 text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/50">Altura (cm)</label>
          <input
            type="number"
            placeholder="Ex: 170"
            value={data.height}
            onChange={e => set('height', e.target.value)}
            min={1}
            required
            className="bg-bg-card border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/25 text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all"
          />
        </div>

        {/* Condições de saúde */}
        <SectionLabel>Condições de saúde</SectionLabel>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-white/70">Você tem hipertensão?</label>
          <YesNoToggle value={data.hypertension} onChange={v => set('hypertension', v)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-white/70">Você tem diabetes?</label>
          <YesNoToggle value={data.diabetes} onChange={v => set('diabetes', v)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-white/70">Faz uso de medicamentos?</label>
          <YesNoToggle value={data.medications} onChange={v => set('medications', v)} />
        </div>

        {/* Histórico */}
        <SectionLabel>Histórico</SectionLabel>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-white/70">Possui histórico cardíaco?</label>
          <YesNoToggle value={data.cardiacHistory} onChange={v => set('cardiacHistory', v)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-white/70">Histórico familiar de doenças cardíacas?</label>
          <YesNoToggle value={data.familyHistory} onChange={v => set('familyHistory', v)} />
        </div>

        {/* Aviso */}
        <div className="bg-bg-card border border-white/8 rounded-xl p-4 mt-1">
          <p className="flex items-start gap-2 text-xs text-white/30 leading-relaxed">
            <AlertTriangle className="flex-shrink-0 mt-0.5 text-yellow-500/60" size={14} />
            <span>O CardioSense não substitui consultas médicas. Informações com caráter educativo e preventivo.</span>
          </p>
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent-dark text-white font-semibold rounded-2xl py-4 text-sm transition-all duration-200 shadow-[0_0_20px_rgba(0,180,216,0.3)] hover:shadow-[0_0_35px_rgba(0,180,216,0.5)] active:scale-95 disabled:opacity-50 mt-2"
        >
          {loading ? 'Salvando...' : 'Continuar para o Monitor'}
        </button>
      </form>
      <BottomNav />
    </div>
  )
}
