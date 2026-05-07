'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import CampaignCard from '@/components/CampaignCard'
import API from '@/lib/api'

export default function Home() {
  const [newCampaigns, setNewCampaigns] = useState([])
  const [activeCampaigns, setActiveCampaigns] = useState([])
  const [completedCampaigns, setCompletedCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [newRes, activeRes, completedRes] = await Promise.all([
          API.get('/campaigns/new'),
          API.get('/campaigns/active'),
          API.get('/campaigns/completed')
        ])
        setNewCampaigns(newRes.data)
        setActiveCampaigns(activeRes.data)
        setCompletedCampaigns(completedRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return (
    <main style={{ backgroundColor: '#fcfbf9', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />

      {/* HERO SECTION - Cinematic AI Video */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: '650px', // Increased height for premium feel
        overflow: 'hidden',
        backgroundColor: '#0f2d1f'
      }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 15%',
            opacity: 0.85 // Brighter for better AI visibility
          }}
          src="https://res.cloudinary.com/dugbnq9oz/video/upload/v1778066710/ihsan_msps5v.mp4"
        />
        
        {/* Softened Premium Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(15,45,31,0.92) 35%, rgba(15,45,31,0.4) 70%, transparent)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 80px'
        }}>
          <div style={{ maxWidth: '600px', marginTop: '40px' }}>
            <div style={{
              fontSize: '13px',
              color: '#c9a84c',
              fontWeight: '800',
              letterSpacing: '4px',
              marginBottom: '16px',
              textTransform: 'uppercase'
            }}>
              Platform Derma Dipercayai
            </div>
            <h1 style={{
              fontSize: '52px',
              fontWeight: '900',
              color: '#ffffff',
              lineHeight: '1.1',
              margin: '0 0 20px 0',
              letterSpacing: '-1px'
            }}>
              Derma Dengan<br />
              <span style={{ color: '#c9a84c' }}>Amanah & Telus</span>
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#d1fae5',
              marginBottom: '32px',
              lineHeight: '1.7',
              fontWeight: '400',
              opacity: 0.9
            }}>
              Sumbangan anda terus ke masjid atau surau pilihan anda.<br />
              Tiada perantara. Tiada keraguan. Hanya pahala.
            </p>
            <button
              onClick={() => document.getElementById('kempen-aktif').scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: '#c9a84c',
                border: 'none',
                color: '#fff',
                padding: '16px 36px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '800',
                boxShadow: '0 10px 25px rgba(201, 168, 76, 0.3)',
                transition: 'transform 0.2s ease'
              }}
            >
              Lihat Kempen
            </button>
          </div>
        </div>
      </section>

      {/* PREMIUM TRUST STRIP */}
      <section style={{
        backgroundColor: '#1d6a4e',
        padding: '24px 80px',
        display: 'flex',
        gap: '60px',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        {[
          { text: 'Masjid & Surau Disahkan' },
          { text: 'Wang Terus Ke Masjid' },
          { text: 'Telus & Boleh Dipercayai' },
          { text: 'Terbuka Seluruh Malaysia' }
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#c9a84c' }} />
            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700', letterSpacing: '0.5px' }}>
              {item.text}
            </span>
          </div>
        ))}
      </section>

      {/* CAMPAIGNS SECTION */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 32px' }}>

        {newCampaigns.length > 0 && (
          <section style={{ marginBottom: '72px' }}>
            <SectionHeader
              badge="BARU"
              badgeColor="#3b82f6"
              title="Kempen Terbaru"
              subtitle="Peluang terawal untuk menyumbang"
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
              {newCampaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          </section>
        )}

        <section id="kempen-aktif" style={{ marginBottom: '72px' }}>
          <SectionHeader
            badge="AKTIF"
            badgeColor="#1d6a4e"
            title="Sedang Berjalan"
            subtitle="Bersama membantu merealisasikan impian ummah"
          />
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ color: '#1d6a4e', fontWeight: '700' }}>Memuatkan kempen...</div>
            </div>
          ) : activeCampaigns.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>Tiada kempen aktif buat masa ini.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
              {activeCampaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          )}
        </section>

        {completedCampaigns.length > 0 && (
          <section style={{ marginBottom: '72px' }}>
            <SectionHeader
              badge="SELESAI"
              badgeColor="#c9a84c"
              title="Kempen Berjaya"
              subtitle="Bukti kekuatan sumbangan anda"
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
              {completedCampaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          </section>
        )}

      </div>

      {/* PREMIUM FOOTER */}
      <footer style={{
        backgroundColor: '#0a1a14', // Deeper green-black
        color: '#9ca3af',
        textAlign: 'center',
        padding: '64px 32px',
        fontSize: '14px',
        borderTop: '1px solid rgba(201, 168, 76, 0.1)'
      }}>
        <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '24px', marginBottom: '12px', letterSpacing: '2px' }}>IHSAN</div>
        <div style={{ color: '#d1fae5', fontWeight: '600', marginBottom: '24px' }}>Platform Derma Masjid & Surau Malaysia</div>
        <div style={{ maxWidth: '600px', margin: '0 auto 32px', lineHeight: '1.6', opacity: 0.7 }}>
          Menghubungkan penyumbang dengan rumah Allah secara terus, telus, dan tanpa ragu.
        </div>
        <div style={{ color: '#4b5563', fontSize: '12px' }}>© 2026 IHSAN. Hak Cipta Terpelihara.</div>
      </footer>
    </main>
  )
}

function SectionHeader({ badge, badgeColor, title, subtitle }) {
  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
        <span style={{
          backgroundColor: badgeColor,
          color: '#fff',
          fontSize: '10px',
          fontWeight: '900',
          padding: '4px 12px',
          borderRadius: '30px',
          letterSpacing: '1.5px'
        }}>{badge}</span>
        <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#0f2d1f', margin: 0, letterSpacing: '-0.5px' }}>{title}</h2>
      </div>
      <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>{subtitle}</p>
      <div style={{ width: '60px', height: '4px', backgroundColor: '#c9a84c', marginTop: '14px', borderRadius: '10px' }} />
    </div>
  )
}