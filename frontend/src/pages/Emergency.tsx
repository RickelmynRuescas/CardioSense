import { useState } from 'react'
import { Phone, MapPin, Users, AlertTriangle, X, Plus, Trash2, ShieldAlert } from 'lucide-react'
import BottomNav from '../components/BottomNav'

interface Contact {
  name: string
  phone: string
}

export default function Emergency() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [sosPressed, setSosPressed] = useState(false)

  function handleSOS() {
    setSosPressed(true)
    setTimeout(() => {
      setSosPressed(false)
      window.location.href = 'tel:192'
    }, 800)
  }

  function handleAddContact(e: React.FormEvent) {
    e.preventDefault()
    if (newName && newPhone) {
      setContacts(prev => [...prev, { name: newName, phone: newPhone }])
      setNewName('')
      setNewPhone('')
      setShowAddModal(false)
    }
  }

  function removeContact(i: number) {
    setContacts(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div className="min-h-svh flex flex-col bg-bg-primary pb-24">
      <div className="px-5 pt-10 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <ShieldAlert size={20} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">Emergência</h1>
            <p className="text-xs text-white/40 mt-0.5">Em caso de emergência, pressione o botão SOS</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-5 gap-6 max-w-sm w-full mx-auto">
        {/* SOS Button */}
        <div className="flex flex-col items-center gap-3 py-4">
          <button
            onClick={handleSOS}
            className={`w-40 h-40 rounded-full font-black text-4xl text-white select-none
              ${sosPressed
                ? 'bg-red-600 scale-95 shadow-[0_0_60px_rgba(239,68,68,0.8)]'
                : 'bg-red-500 hover:bg-red-600 sos-pulse'
              }`}
          >
            SOS
          </button>
          {sosPressed && (
            <p className="text-sm text-red-400 font-medium animate-pulse">Enviando alerta de emergência...</p>
          )}
          {!sosPressed && (
            <p className="text-xs text-white/30 text-center max-w-[200px] leading-relaxed">
              Precisa de ajuda? Pressione o botão para acionar emergência
            </p>
          )}
        </div>

        {/* Quick actions */}
        <div className="w-full flex flex-col gap-3">
          <a
            href="tel:192"
            className="flex items-center gap-4 bg-bg-card border border-white/10 rounded-2xl px-5 py-4 hover:border-accent/30 transition-all active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
              <Phone size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Ligar para o SAMU</p>
              <p className="text-xs text-white/40">192 — Serviço de Atendimento Móvel</p>
            </div>
          </a>

          <a
            href="tel:193"
            className="flex items-center gap-4 bg-bg-card border border-white/10 rounded-2xl px-5 py-4 hover:border-accent/30 transition-all active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Bombeiros</p>
              <p className="text-xs text-white/40">193 — Corpo de Bombeiros</p>
            </div>
          </a>

          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pos => {
                  const { latitude, longitude } = pos.coords
                  window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank')
                })
              }
            }}
            className="flex items-center gap-4 bg-bg-card border border-white/10 rounded-2xl px-5 py-4 hover:border-accent/30 transition-all active:scale-[0.98] w-full text-left"
          >
            <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
              <MapPin size={18} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Compartilhar Localização</p>
              <p className="text-xs text-white/40">Envie sua localização atual</p>
            </div>
          </button>
        </div>

        {/* Emergency contacts */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-white/40" />
              <p className="text-xs text-white/40 font-medium">Contatos de emergência</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 text-xs text-accent hover:text-accent-light transition-colors"
            >
              <Plus size={14} />
              Adicionar
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {contacts.length === 0 && (
              <p className="text-xs text-white/20 text-center py-4">Nenhum contato cadastrado</p>
            )}
            {contacts.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-bg-card border border-white/10 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">{c.name}</p>
                  <p className="text-xs text-white/40">{c.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${c.phone.replace(/\D/g, '')}`}
                    className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent hover:bg-accent/20 transition-all"
                  >
                    <Phone size={14} />
                  </a>
                  <button
                    onClick={() => removeContact(i)}
                    className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add contact modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 pb-6">
          <div className="w-full max-w-sm bg-bg-secondary border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Novo contato</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddContact} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nome"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                required
                className="bg-bg-card border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                required
                className="bg-bg-card border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
              />
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:border-white/20 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-accent hover:bg-accent-dark text-white text-sm font-semibold transition-all active:scale-95"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
