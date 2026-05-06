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
    <main style={{ backgroundColor: '#f8f7f4', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />

      {/* HERO */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: '520px',
        overflow: 'hidden',
        backgroundColor: '#0f2d1f'
      }}>
        <video
          autoPlay
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 15%',
            opacity: 0.75
          }}
          src="https://res.cloudinary.com/dugbnq9oz/video/upload/v1778066710/ihsan_msps5v.mp4"
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(15,45,31,0.88) 45%, transparent)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 60px'
        }}>
          <div style={{ maxWidth: '540px' }}>
            <div style={{
              fontSize: '12px',
              color: '#c9a84c',
              fontWeight: '700',
              letterSpacing: '3px',
              marginBottom: '12px'
            }}>
              PLATFORM DERMA DIPERCAYAI
            </div>
            <h1 style={{
              fontSize: '42px',
              fontWeight: '800',
              color: '#ffffff',
              lineHeight: '1.2',
              margin: '0 0 16px 0'
            }}>
              Derma Dengan<br />
              <span style={{ color: '#c9a84c' }}>Amanah & Telus</span>
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#d1fae5',
              marginBottom: '28px',
              lineHeight: '1.6'
            }}>
              Sumbangan anda terus ke masjid atau surau pilihan anda.
              Tiada perantara. Tiada keraguan.
            </p>
            <button
              onClick={() => document.getElementById('kempen-aktif').scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: '#c9a84c',
                border: 'none',
                color: '#fff',
                padding: '14px 28px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '700'
              }}
            >
              Lihat Kempen
            </button>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{
        backgroundColor: '#1d6a4e',
        padding: '16px 60px',
        display: 'flex',
        gap: '40px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {[
          { icon: '✓', text: 'Masjid & Surau Disahkan' },
          { icon: '✓', text: 'Wang Terus Ke Masjid' },
          { icon: '✓', text: 'Telus & Boleh Dipercayai' },
          { icon: '✓', text: 'Terbuka Seluruh Malaysia' }
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#c9a84c', fontWeight: '800', fontSize: '16px' }}>{item.icon}</span>
            <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600' }}>{item.text}</span>
          </div>
        ))}
      </section>

      {/* CAMPAIGNS */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>

        {newCampaigns.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <SectionHeader
              badge="BARU"
              badgeColor="#3b82f6"
              title="Kempen Terbaru"
              subtitle="Kempen yang baru sahaja dilancarkan"
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {newCampaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          </section>
        )}

        <section id="kempen-aktif" style={{ marginBottom: '56px' }}>
          <SectionHeader
            badge="AKTIF"
            badgeColor="#1d6a4e"
            title="Kempen Sedang Berjalan"
            subtitle="Hulurkan sumbangan anda sekarang"
          />
          {loading ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>Memuatkan kempen...</p>
          ) : activeCampaigns.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>Tiada kempen aktif buat masa ini.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {activeCampaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          )}
        </section>

        {completedCampaigns.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <SectionHeader
              badge="SELESAI"
              badgeColor="#c9a84c"
              title="Kempen Telah Berjaya"
              subtitle="Bukti kepercayaan bersama"
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {completedCampaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          </section>
        )}

      </div>

      {/* FOOTER */}
      <footer style={{
        backgroundColor: '#1a1a1a',
        color: '#9ca3af',
        textAlign: 'center',
        padding: '32px 24px',
        fontSize: '13px'
      }}>
        <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '18px', marginBottom: '8px' }}>IHSAN</div>
        <div>Platform Derma Masjid & Surau Malaysia</div>
        <div style={{ marginTop: '8px', color: '#6b7280' }}>© 2026 IHSAN. Hak Cipta Terpelihara.</div>
      </footer>
    </main>
  )
}

function SectionHeader({ badge, badgeColor, title, subtitle }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
        <span style={{
          backgroundColor: badgeColor,
          color: '#fff',
          fontSize: '11px',
          fontWeight: '700',
          padding: '3px 10px',
          borderRadius: '20px',
          letterSpacing: '1px'
        }}>{badge}</span>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>{title}</h2>
      </div>
      <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{subtitle}</p>
      <div style={{ width: '48px', height: '3px', backgroundColor: badgeColor, marginTop: '10px', borderRadius: '2px' }} />
    </div>
  )
}