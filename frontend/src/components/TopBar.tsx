import { auth } from '../config/firebase'

export default function TopBar() {
  const userName = auth.currentUser?.displayName?.split(' ')[0] ?? 'usuário'

  return (
    <div className="px-5 pt-10 pb-1 flex items-center justify-end">
      <p className="text-xs text-white/40 font-medium">
        Olá, <span className="text-accent font-semibold">{userName}</span> 👋
      </p>
    </div>
  )
}
