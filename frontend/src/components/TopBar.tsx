import { Hand } from 'lucide-react'
import { auth } from '../config/firebase'

export default function TopBar() {
  const userName = auth.currentUser?.displayName?.split(' ')[0] ?? 'usuário'

  return (
    <div className="px-5 pt-10 pb-1 flex items-center justify-end">
      <p className="flex items-center gap-1.5 text-xs text-white/40 font-medium">
        <span>Olá, <span className="text-accent font-semibold">{userName}</span></span>
        <Hand className="text-accent" size={13} />
      </p>
    </div>
  )
}
