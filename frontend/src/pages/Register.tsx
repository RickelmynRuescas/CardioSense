import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName: name })
      // Desloga a sessão criada automaticamente para que o usuário entre pelo login
      await signOut(auth)
      navigate('/login', { state: { registered: true } })
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está cadastrado.')
      } else {
        setError('Erro ao criar conta. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh flex flex-col bg-bg-primary px-5 py-10">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Criar conta</h1>
          <p className="text-sm text-white/40 mt-1">Preencha seus dados para começar</p>
        </div>

        <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full bg-bg-card border border-white/10 rounded-xl pl-11 pr-4 py-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
            />
          </div>

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
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirmar senha"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className="w-full bg-bg-card border border-white/10 rounded-xl pl-11 pr-11 py-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
            />
            <button type="button" onClick={() => setShowConfirm(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-xs text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl py-4 text-sm transition-all duration-200 shadow-[0_0_20px_rgba(0,180,216,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="text-sm text-white/40">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-accent hover:text-accent-light font-medium transition-colors">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
