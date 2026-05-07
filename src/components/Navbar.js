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
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Frosted glass effect
      backdropFilter: 'blur(12px)',               // Premium blur
      WebkitBackdropFilter: 'blur(12px)',         // Safari support
      padding: '0 60px',                          // Aligned with Hero text
      height: '80px',                             // Slightly taller for premium feel
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'fixed',                          // Floats over video
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
      borderBottom: '1px solid rgba(201, 168, 76, 0.2)' // Subtle gold border
    }}>

      {/* LOGO SECTION */}
      <div
        onClick={() => router.push('/')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
      >
        <div style={{
          backgroundColor: '#1d6a4e',
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(29, 106, 78, 0.2)'
        }}>
          <span style={{ color: '#c9a84c', fontWeight: '900', fontSize: '18px' }}>I</span>
        </div>
        <div>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: '900', 
            color: '#1d6a4e', 
            letterSpacing: '1.5px',
            lineHeight: '1'
          }}>
            IHSAN
          </div>
          <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '600', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Platform Derma Amanah
          </div>
        </div>
      </div>

      {/* NAV BUTTONS */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {!role && (
          <>
            <button
              onClick={() => router.push('/daftar')}
              style={{
                background: 'transparent',
                border: '1.5px solid #1d6a4e',
                color: '#1d6a4e',
                padding: '10px 22px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '700',
                transition: 'all 0.3s ease'
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
                padding: '11px 24px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(29, 106, 78, 0.25)',
                transition: 'all 0.3s ease'
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
                padding: '10px 22px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '700'
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
                padding: '11px 24px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '700'
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
                padding: '10px 22px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '700'
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
                padding: '11px 24px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '700'
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