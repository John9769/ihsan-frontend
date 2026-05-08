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
    <main style={{ 
      backgroundColor: '#fdfdfc', 
      minHeight: '100vh', 
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      backgroundImage: 'linear-gradient(to bottom, #f0fdf4 0%, #fdfdfc 400px)' 
    }}>
      <Navbar />

      <div style={{ maxWidth: '440px', margin: '0 auto', paddingTop: '180px', paddingBottom: '100px', paddingLeft: '24px', paddingRight: '24px' }}>

        {/* HEADER SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            width: '70px',
            height: '70px',
            borderRadius: '20px',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(29, 106, 78, 0.1)',
            border: '1px solid rgba(29, 106, 78, 0.05)'
          }}>
            {/* MODERN SECURE KEY ICON */}
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2889/2889676.png" 
              alt="Login Icon" 
              style={{ width: '35px', height: '35px', opacity: 0.9 }}
            />
          </div>
          
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f2d1f', margin: '0 0 10px', letterSpacing: '-1.5px' }}>
            Log Masuk
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>
            Akses dashboard digital IHSAN anda
          </p>
        </div>

        {/* PREMIUM TOGGLE SWITCH */}
        <div style={{
          display: 'flex',
          backgroundColor: 'rgba(29, 106, 78, 0.05)',
          borderRadius: '14px',
          padding: '6px',
          marginBottom: '32px',
          border: '1px solid rgba(29, 106, 78, 0.05)'
        }}>
          {['PREMISE', 'ADMIN'].map(type => (
            <button
              key={type}
              onClick={() => setLoginType(type)}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '800',
                backgroundColor: loginType === type ? '#1d6a4e' : 'transparent',
                color: loginType === type ? '#ffffff' : '#64748b',
                boxShadow: loginType === type ? '0 4px 12px rgba(29, 106, 78, 0.2)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {type === 'PREMISE' ? 'Masjid / Surau' : 'Admin'}
            </button>
          ))}
        </div>

        {/* LOGIN FORM CARD */}
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
            border: '1px solid #f1f5f9'
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '8px',
              paddingLeft: '4px'
            }}>
              Alamat Emel
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="cth: admin@masjid.com"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '8px',
              paddingLeft: '4px'
            }}>
              Kata Laluan
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fff1f2',
              border: '1px solid #ffe4e6',
              color: '#e11d48',
              padding: '14px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '700',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px',
              backgroundColor: loading ? '#cbd5e1' : '#1d6a4e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '800',
              boxShadow: loading ? 'none' : '0 10px 25px rgba(29, 106, 78, 0.25)',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Sila Tunggu...' : 'Masuk ke Dashboard'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginTop: '28px', fontWeight: '500' }}>
            Belum ada akaun?{' '}
            <span
              onClick={() => router.push('/daftar')}
              style={{ color: '#1d6a4e', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Daftar Premis Sekarang
            </span>
          </p>
        </form>
      </div>
    </main>
  )
}

const inputStyle = {
  width: '100%',
  padding: '16px 20px',
  border: '2px solid #f1f5f9',
  borderRadius: '14px',
  fontSize: '15px',
  color: '#0f172a',
  backgroundColor: '#f8fafc',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all 0.3s ease',
  fontFamily: 'inherit'
}