import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Heart, History, AlertTriangle, Activity, ClipboardList, LogOut } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

const navItems = [
  { path: '/welcome',        icon: Home,          label: 'Início'    },
  { path: '/health-profile', icon: ClipboardList, label: 'Cadastro'  },
  { path: '/monitor',        icon: Heart,         label: 'Monitor'   },
  { path: '/result',         icon: Activity,      label: 'Resultado' },
  { path: '/history',        icon: History,       label: 'Histórico' },
  { path: '/emergency',      icon: AlertTriangle, label: 'Emergência'},
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut(auth)
    localStorage.removeItem('healthProfile')
    navigate('/login')
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg-secondary border-t border-white/10">
      <div className="w-full flex items-center justify-between px-2 py-1">

        {/* Nav items — esquerda */}
        <div className="flex items-center flex-1 min-w-0">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all duration-200 flex-1 min-w-0 ${
                  active ? 'text-accent' : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Icon
                  size={26}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={active ? 'drop-shadow-[0_0_6px_#00b4d8]' : ''}
                />
                <span className="text-[10px] font-medium leading-none truncate w-full text-center">{label}</span>
              </button>
            )
          })}
        </div>

        {/* Sair — direita, isolado */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all duration-200 text-red-400/60 hover:text-red-400 shrink-0"
        >
          <LogOut size={26} strokeWidth={1.8} />
          <span className="text-[10px] font-medium leading-none">Sair</span>
        </button>

      </div>
    </nav>
  )
}
