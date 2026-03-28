import { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Pill, FileText, Clock, Calendar, Moon, Sun, Lock, Unlock } from 'lucide-react'
import { useAuth } from '../lib/auth'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/medications', icon: Pill, label: 'Medications' },
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/timeline', icon: Clock, label: 'Timeline' },
  { to: '/appointments', icon: Calendar, label: 'Appointments' },
]

export default function Layout() {
  const { authenticated, logout } = useAuth()
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('mj-dark-mode')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('mj-dark-mode', dark)
  }, [dark])

  return (
    <div className="min-h-screen bg-cream dark:bg-cream-dark flex transition-colors">
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Floating Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sage/40 dark:bg-sage-dark/30 blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-lavender/40 dark:bg-lavender-dark/30 blur-3xl animate-float-delay" />
        <div className="absolute -bottom-16 right-1/3 w-64 h-64 rounded-full bg-peach/20 dark:bg-peach-dark/20 blur-3xl animate-float" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card/80 dark:bg-card-dark/80 backdrop-blur-xl border-r border-border dark:border-border-dark fixed h-full z-10 transition-colors">
        <div className="p-6 border-b border-border dark:border-border-dark">
          <h1 className="text-xl font-bold text-ink dark:text-ink-dark">MJ Health</h1>
          <p className="font-cursive text-3xl text-peach dark:text-peach-dark leading-tight -mt-1">companion</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-peach/20 text-ink dark:text-ink-dark dark:bg-peach-dark/20'
                    : 'text-muted dark:text-muted-dark hover:bg-sage/30 dark:hover:bg-sage-dark/30 hover:text-ink dark:hover:text-ink-dark'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border dark:border-border-dark space-y-2">
          <div className="text-xs text-muted dark:text-muted-dark">Patient: Mahak Jahan Aara</div>
          <div className="text-xs text-muted dark:text-muted-dark">SGPGI Lucknow</div>
          {authenticated && (
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-2xl text-sm text-muted dark:text-muted-dark hover:bg-sage/30 dark:hover:bg-sage-dark/30 transition-colors"
            >
              <Unlock size={16} />
              Logged In
            </button>
          )}
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-2xl text-sm text-muted dark:text-muted-dark hover:bg-sage/30 dark:hover:bg-sage-dark/30 transition-colors"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-6 relative z-[1]">
        <Outlet />
      </main>

      {/* Mobile Bottom Tabs */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/80 dark:bg-card-dark/80 backdrop-blur-xl border-t border-border dark:border-border-dark z-10 flex transition-colors">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
                isActive ? 'text-peach dark:text-peach-dark' : 'text-muted dark:text-muted-dark'
              }`
            }
          >
            <Icon size={20} />
            <span className="mt-1">{label}</span>
          </NavLink>
        ))}
        <button
          onClick={() => setDark(!dark)}
          className="flex-1 flex flex-col items-center py-2 text-xs text-muted dark:text-muted-dark transition-colors"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
          <span className="mt-1">{dark ? 'Light' : 'Dark'}</span>
        </button>
      </nav>
    </div>
  )
}
