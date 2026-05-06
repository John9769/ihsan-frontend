'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import API from '@/lib/api'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginType, setLoginType] = useState('PREMISE')

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const endpoint = loginType === 'ADMIN'
        ? '/auth/admin/login'
        : '/auth/premise/login'

      const res = await API.post(endpoint, form)

      localStorage.setItem('ihsan_token', res.data.token)
      localStorage.setItem('ihsan_role', res.data.role)
      localStorage.setItem('ihsan_name', res.data.name || res.data.email)

      if (res.data.role === 'SUPER_ADMIN') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ralat berlaku. Sila cuba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ backgroundColor: '#f8f7f4', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: '420px', margin: '80px auto', padding: '0 24px' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#1d6a4e',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            lineHeight: '48px',
            fontSize: '22px',
            marginBottom: '12px'
          }}>🔐</div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 8px' }}>
            Log Masuk
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Masuk ke akaun IHSAN anda
          </p>
        </div>

        {/* TOGGLE */}
        <div style={{
          display: 'flex',
          backgroundColor: '#e8e4dc',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '24px'
        }}>
          {['PREMISE', 'ADMIN'].map(type => (
            <button
              key={type}
              onClick={() => setLoginType(type)}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '700',
                backgroundColor: loginType === type ? '#1d6a4e' : 'transparent',
                color: loginType === type ? '#ffffff' : '#6b7280',
                transition: 'all 0.2s'
              }}
            >
              {type === 'PREMISE' ? 'Masjid / Surau' : 'Admin'}
            </button>
          ))}
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Emel <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="emel@masjid.com"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1.5px solid #e8e4dc',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1a1a1a',
                backgroundColor: '#fafaf9',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Kata Laluan <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Kata laluan anda"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1.5px solid #e8e4dc',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1a1a1a',
                backgroundColor: '#fafaf9',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? '#9ca3af' : '#1d6a4e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: '700'
            }}
          >
            {loading ? 'Sedang Log Masuk...' : 'Log Masuk'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '16px' }}>
            Belum ada akaun?{' '}
            <span
              onClick={() => router.push('/daftar')}
              style={{ color: '#1d6a4e', fontWeight: '700', cursor: 'pointer' }}
            >
              Daftar Sekarang
            </span>
          </p>
        </form>
      </div>
    </main>
  )
}