'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [role, setRole] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('ihsan_token')
    const userRole = localStorage.getItem('ihsan_role')
    if (token) setRole(userRole)
  }, [])

  const logout = () => {
    localStorage.removeItem('ihsan_token')
    localStorage.removeItem('ihsan_role')
    localStorage.removeItem('ihsan_name')
    router.push('/')
  }

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      padding: '0 32px',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      borderBottom: '1px solid #e8e4dc'
    }}>

      {/* LOGO */}
      <div
        onClick={() => router.push('/')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <div style={{
          backgroundColor: '#1d6a4e',
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ color: '#c9a84c', fontWeight: '800', fontSize: '16px' }}>I</span>
        </div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#1d6a4e', letterSpacing: '1px' }}>
            IHSAN
          </div>
          <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '-2px' }}>
            Platform Derma Masjid & Surau
          </div>
        </div>
      </div>

      {/* NAV BUTTONS */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {!role && (
          <>
            <button
              onClick={() => router.push('/daftar')}
              style={{
                background: 'transparent',
                border: '1.5px solid #1d6a4e',
                color: '#1d6a4e',
                padding: '8px 18px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              Daftar Masjid
            </button>
            <button
              onClick={() => router.push('/login')}
              style={{
                background: '#1d6a4e',
                border: 'none',
                color: '#ffffff',
                padding: '8px 18px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              Log Masuk
            </button>
          </>
        )}

        {role === 'PREMISE' && (
          <>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                background: 'transparent',
                border: '1.5px solid #1d6a4e',
                color: '#1d6a4e',
                padding: '8px 18px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              Dashboard
            </button>
            <button
              onClick={logout}
              style={{
                background: '#ef4444',
                border: 'none',
                color: '#fff',
                padding: '8px 18px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              Log Keluar
            </button>
          </>
        )}

        {role === 'SUPER_ADMIN' && (
          <>
            <button
              onClick={() => router.push('/admin')}
              style={{
                background: 'transparent',
                border: '1.5px solid #c9a84c',
                color: '#c9a84c',
                padding: '8px 18px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              Admin Panel
            </button>
            <button
              onClick={logout}
              style={{
                background: '#ef4444',
                border: 'none',
                color: '#fff',
                padding: '8px 18px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              Log Keluar
            </button>
          </>
        )}
      </div>
    </nav>
  )
}