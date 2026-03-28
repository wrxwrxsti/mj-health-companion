import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

const AUTH_PASSWORD = 'mahakhealth'
const STORAGE_KEY = 'mj-health-auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY) === 'true'
  })

  const login = useCallback((password) => {
    if (password === AUTH_PASSWORD) {
      setAuthenticated(true)
      sessionStorage.setItem(STORAGE_KEY, 'true')
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setAuthenticated(false)
    sessionStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export function PasswordGate({ children, onCancel }) {
  const { authenticated, login } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  if (authenticated) return children

  function handleSubmit(e) {
    e.preventDefault()
    if (!login(password)) {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-card dark:bg-card-dark rounded-[2rem] w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-ink dark:text-ink-dark mb-1">Authentication Required</h2>
        <p className="text-sm text-muted dark:text-muted-dark mb-4">Enter the password to make changes.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            className="input"
            autoFocus
          />
          {error && <p className="text-red-500 text-xs">Incorrect password. Try again.</p>}
          <div className="flex gap-2">
            <button type="button" onClick={onCancel}
              className="flex-1 py-2 rounded-2xl text-sm font-medium border border-border dark:border-border-dark text-muted dark:text-muted-dark hover:bg-sage/30 dark:hover:bg-sage-dark/30 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 bg-peach dark:bg-peach-dark text-white py-2 rounded-2xl text-sm font-medium hover:opacity-90 transition-opacity">
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Hook for protecting any action behind auth
export function useProtectedAction() {
  const { authenticated, login } = useAuth()
  const [showGate, setShowGate] = useState(false)
  const pendingRef = useRef(null)

  // When authenticated changes to true and we have a pending action, execute it
  useEffect(() => {
    if (authenticated && pendingRef.current) {
      const action = pendingRef.current
      pendingRef.current = null
      setShowGate(false)
      action()
    }
  }, [authenticated])

  function protect(action) {
    if (authenticated) {
      action()
    } else {
      pendingRef.current = action
      setShowGate(true)
    }
  }

  const gate = showGate && !authenticated ? (
    <PasswordGate onCancel={() => { setShowGate(false); pendingRef.current = null }}>
      <span />
    </PasswordGate>
  ) : null

  return { protect, gate }
}
