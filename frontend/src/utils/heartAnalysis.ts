const BPM_RANGES: Record<string, { baixa: number; normalMin: number; normalMax: number; alta: number }> = {
  '0-1_mes':    { baixa: 100, normalMin: 100, normalMax: 160, alta: 160 },
  '1-12_meses': { baixa: 90,  normalMin: 90,  normalMax: 160, alta: 160 },
  '1-5_anos':   { baixa: 80,  normalMin: 80,  normalMax: 120, alta: 120 },
  '6-12_anos':  { baixa: 70,  normalMin: 70,  normalMax: 110, alta: 110 },
  '13-17_anos': { baixa: 60,  normalMin: 60,  normalMax: 100, alta: 100 },
  '18-64_anos': { baixa: 60,  normalMin: 60,  normalMax: 100, alta: 100 },
  '65+_anos':   { baixa: 60,  normalMin: 60,  normalMax: 100, alta: 100 },
}

function getAgeGroup(age: number): string {
  if (age <= 17)  return '13-17_anos'
  if (age <= 64)  return '18-64_anos'
  return '65+_anos'
}

type BpmStatus = 'baixa' | 'normal' | 'elevada' | 'muito_elevada'
type RiskLevel = 'baixo' | 'moderado' | 'alto'

export interface HealthProfile {
  age: string
  sex: string
  weight: string
  height: string
  hypertension: 'sim' | 'nao' | null
  diabetes: 'sim' | 'nao' | null
  cardiacHistory: 'sim' | 'nao' | null
  medications: 'sim' | 'nao' | null
  familyHistory: 'sim' | 'nao' | null
}

export interface AnalysisResult {
  bpmStatus: BpmStatus
  riskLevel: RiskLevel
  riskCount: number
  normalMin: number
  normalMax: number
  ageGroup: string
}

export function analyzeHeartRate(bpm: number, profile: HealthProfile | null): AnalysisResult {
  const age = parseInt(profile?.age ?? '30')
  const ageGroup = getAgeGroup(isNaN(age) ? 30 : age)
  const range = BPM_RANGES[ageGroup]

  let bpmStatus: BpmStatus
  if (bpm < range.normalMin) {
    bpmStatus = 'baixa'
  } else if (bpm <= range.normalMax) {
    bpmStatus = 'normal'
  } else if (bpm <= range.normalMax + 20) {
    bpmStatus = 'elevada'
  } else {
    bpmStatus = 'muito_elevada'
  }

  const riskFactors = [
    profile?.hypertension === 'sim',
    profile?.diabetes === 'sim',
    profile?.cardiacHistory === 'sim',
    profile?.familyHistory === 'sim',
    profile?.medications === 'sim',
  ]
  const riskCount = riskFactors.filter(Boolean).length

  let riskLevel: RiskLevel
  if (bpmStatus === 'muito_elevada' || (bpmStatus !== 'normal' && riskCount >= 2) || riskCount >= 3) {
    riskLevel = 'alto'
  } else if (bpmStatus === 'elevada' || bpmStatus === 'baixa' || riskCount >= 1) {
    riskLevel = 'moderado'
  } else {
    riskLevel = 'baixo'
  }

  return { bpmStatus, riskLevel, riskCount, normalMin: range.normalMin, normalMax: range.normalMax, ageGroup }
}
