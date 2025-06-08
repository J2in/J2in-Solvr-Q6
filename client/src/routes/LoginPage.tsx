// src/routes/LoginPage.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api, { ApiResponse } from '../services/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { refreshUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // ApiResponse<{ token: string }> 으로 받는다
      const res = await api.post<ApiResponse<{ token: string }>>('/session/login', { email })
      if (!res.data.data) {
        throw new Error('로그인 응답에 토큰이 없습니다.')
      }
      const token = res.data.data.token
      localStorage.setItem('token', token)
      await refreshUser()
      navigate('/') // 로그인 후 홈으로
    } catch (err: any) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>로그인</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label>
        이메일
        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? '로그인 중…' : '로그인'}
      </Button>
    </form>
  )
}
