import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../config/firebase'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const registered = (location.state as { registered?: boolean } | null)?.registered ?? false
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetError, setResetError] = useState('')
  const [resetLoading, setResetLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/welcome')
    } catch {
      setError('E-mail ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setResetError('')
    setResetLoading(true)
    try {
      await sendPasswordResetEmail(auth, resetEmail)
      setResetSent(true)
    } catch {
      setResetError('E-mail não encontrado. Verifique e tente novamente.')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-bg-primary px-5 py-10">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <svg viewBox="0 0 100 90" className="w-24 h-24" fill="none">
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
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white tracking-wide">CardioSense</h1>
            <p className="text-xs text-white/40 mt-1">Monitoramento inteligente, cuidado que salva vidas.</p>
          </div>
        </div>

        {registered && (
          <div className="fade-in-down w-full flex items-center justify-center gap-2 text-accent">
            <CheckCircle2 className="flex-shrink-0" size={16} />
            <span className="text-sm">Conta criada! Faça login para continuar.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-bg-card border border-white/10 rounded-xl pl-11 pr-4 py-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-bg-card border border-white/10 rounded-xl pl-11 pr-11 py-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl py-4 text-sm transition-all duration-200 shadow-[0_0_20px_rgba(0,180,216,0.3)] hover:shadow-[0_0_30px_rgba(0,180,216,0.5)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <button
            type="button"
            onClick={() => { setShowReset(true); setResetSent(false); setResetError(''); setResetEmail('') }}
            className="text-xs text-white/40 hover:text-accent transition-colors text-center w-full"
          >
            Esqueci minha senha
          </button>
        </form>

        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-white/30">ou</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <p className="text-sm text-white/40">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-accent hover:text-accent-light font-medium transition-colors">
            Criar conta
          </Link>
        </p>
      </div>

      {/* Modal recuperação de senha */}
      {showReset && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 pb-6">
          <div className="w-full max-w-sm bg-bg-secondary border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Recuperar senha</h2>
              <button onClick={() => setShowReset(false)} className="text-white/40 hover:text-white transition-colors">
                <span className="text-xl leading-none">×</span>
              </button>
            </div>

            {resetSent ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-white/50 leading-relaxed">
                  E-mail de recuperação enviado para <span className="text-accent font-medium">{resetEmail}</span>. Verifique sua caixa de entrada.
                </p>
                <p className="text-xs text-white/30 leading-relaxed">
                  Não encontrou? Confira também a pasta de <span className="text-white/50 font-medium">Spam</span> ou <span className="text-white/50 font-medium">Lixo Eletrônico</span>.
                </p>
                <button
                  onClick={() => setShowReset(false)}
                  className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-dark text-white text-sm font-semibold transition-all active:scale-95"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={handleReset} className="flex flex-col gap-3">
                <p className="text-sm text-white/50 leading-relaxed mb-1">
                  Digite seu e-mail cadastrado para receber o link de recuperação.
                </p>
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  required
                  className="bg-bg-card border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
                />
                {resetError && <p className="text-xs text-red-400">{resetError}</p>}
                <div className="flex gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setShowReset(false)}
                    className="flex-1 py-3.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:border-white/20 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 py-3.5 rounded-xl bg-accent hover:bg-accent-dark text-white text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
                  >
                    {resetLoading ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
