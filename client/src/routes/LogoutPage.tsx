// src/routes/LogoutPage.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LogoutPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    logout()
    navigate('/', { replace: true })
  }, [logout, navigate])

  return null // 화면에 아무것도 안 띄워도 됩니다
}
