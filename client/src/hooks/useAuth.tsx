// client/src/hooks/useAuth.tsx
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

interface AuthContextValue {
  userEmail: string | null
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const fetchMe = async () => {
    try {
      const res = await api.get('/session/me')
      setUserEmail(res.data.data.email)
    } catch {
      setUserEmail(null)
    }
  }

  // 마운트 시와, 토큰이 바뀔 때마다 fetchMe 실행
  useEffect(() => {
    fetchMe()
  }, [localStorage.getItem('token')])

  const logout = () => {
    localStorage.removeItem('token')
    setUserEmail(null)
  }

  return (
    <AuthContext.Provider value={{ userEmail, logout, refreshUser: fetchMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
