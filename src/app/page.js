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
    <main style={{ backgroundColor: '#fdfdfc', minHeight: '100vh', fontFamily: '"Inter", "Plus Jakarta Sans", system-ui, sans-serif' }}>
      <Navbar />

      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: '700px', 
        overflow: 'hidden',
        backgroundColor: '#051610'
      }}>
        <video
          autoPlay
          muted
          playsInline
          // Loop removed here to stop AI from talking repeatedly
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 15%',
            opacity: 0.9 
          }}
          src="https://res.cloudinary.com/dugbnq9oz/video/upload/v1778066710/ihsan_msps5v.mp4"
        />
        
        {/* Cinematic Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(5,22,16,0.95) 0%, rgba(5,22,16,0.7) 40%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 80px',
          paddingTop: '80px' // Offset for the fixed Navbar
        }}>
          <div style={{ maxWidth: '650px' }}>
            <div style={{
              fontSize: '14px',
              color: '#c9a84c',
              fontWeight: '800',
              letterSpacing: '5px',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}>
              Platform Derma Dipercayai
            </div>
            <h1 style={{
              fontSize: '64px',
              fontWeight: '900',
              color: '#ffffff',
              lineHeight: '1',
              margin: '0 0 24px 0',
              letterSpacing: '-2px'
            }}>
              Derma Dengan<br />
              <span style={{ color: '#c9a84c' }}>Amanah & Telus</span>
            </h1>
            <p style={{
              fontSize: '20px',
              color: '#e2e8f0',
              marginBottom: '40px',
              lineHeight: '1.6',
              fontWeight: '400',
              maxWidth: '500px'
            }}>
              Sumbangan anda terus ke masjid pilihan anda tanpa perantara.
            </p>

            {/* MOCK SEARCH BAR - Visual Only for Endorsement */}
            <div style={{
              display: 'flex',
              background: '#ffffff',
              padding: '6px',
              borderRadius: '16px',
              maxWidth: '450px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              marginBottom: '20px'
            }}>
              <input 
                type="text" 
                placeholder="Cari Masjid atau Lokasi..." 
                style={{
                  flex: 1,
                  border: 'none',
                  padding: '0 20px',
                  outline: 'none',
                  fontSize: '15px',
                  color: '#334155'
                }}
              />
              <button style={{
                background: '#1d6a4e',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}>
                Cari
              </button>
            </div>

            <div style={{ color: '#94a3b8', fontSize: '13px', display: 'flex', gap: '15px' }}>
              <span>Popular: Masjid Nabawi</span>
              <span>•</span>
              <span>Sultan Ahmed</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{
        backgroundColor: '#1d6a4e',
        padding: '30px 80px',
        display: 'flex',
        gap: '80px',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {[
          'Masjid & Surau Disahkan',
          'Wang Terus Ke Masjid',
          'Telus & Boleh Dipercayai',
          'Terbuka Seluruh Malaysia'
        ].map((text, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '8px', height: '8px', transform: 'rotate(45deg)', backgroundColor: '#c9a84c' }} />
            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '800', letterSpacing: '0.5px' }}>
              {text}
            </span>
          </div>
        ))}
      </section>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '80px 40px' }}>

        {newCampaigns.length > 0 && (
          <section style={{ marginBottom: '80px' }}>
            <SectionHeader
              badge="TERBARU"
              badgeColor="#3b82f6"
              title="Kempen Pilihan"
              subtitle="Peluang terawal untuk membantu pembangunan rumah Allah"
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
              {newCampaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          </section>
        )}

        <section id="kempen-aktif" style={{ marginBottom: '80px' }}>
          <SectionHeader
            badge="AKTIF"
            badgeColor="#1d6a4e"
            title="Sedang Berjalan"
            subtitle="Hulurkan sumbangan ikhlas anda hari ini"
          />
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px', color: '#1d6a4e', fontWeight: '700' }}>
              Memuatkan data...
            </div>
          ) : activeCampaigns.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>Tiada kempen aktif.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
              {activeCampaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          )}
        </section>

        {completedCampaigns.length > 0 && (
          <section>
            <SectionHeader
              badge="SELESAI"
              badgeColor="#c9a84c"
              title="Alhamdulillah"
              subtitle="Kempen-kempen yang telah berjaya mencapai sasaran"
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
              {completedCampaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          </section>
        )}

      </div>

      {/* FOOTER */}
      <footer style={{
        backgroundColor: '#051610',
        color: '#9ca3af',
        textAlign: 'center',
        padding: '80px 40px',
        fontSize: '14px',
        borderTop: '1px solid rgba(201, 168, 76, 0.1)'
      }}>
        <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '28px', marginBottom: '16px', letterSpacing: '3px' }}>IHSAN</div>
        <div style={{ color: '#c9a84c', fontWeight: '700', marginBottom: '32px', letterSpacing: '1px' }}>MENERAJUI KEBAJIKAN DIGITAL</div>
        <div style={{ maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.8', opacity: 0.8 }}>
          Sebuah platform telus untuk memudahkan umat Islam menyumbang terus kepada masjid dan surau di seluruh pelosok negara.
        </div>
        <div style={{ color: '#334155', fontSize: '12px', fontWeight: '600' }}>© 2026 IHSAN MALAYSIA. HAK CIPTA TERPELIHARA.</div>
      </footer>
    </main>
  )
}

function SectionHeader({ badge, badgeColor, title, subtitle }) {
  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#051610', margin: 0, letterSpacing: '-1.5px' }}>{title}</h2>
        <span style={{
          backgroundColor: badgeColor,
          color: '#fff',
          fontSize: '10px',
          fontWeight: '900',
          padding: '4px 14px',
          borderRadius: '50px',
          letterSpacing: '1px'
        }}>{badge}</span>
      </div>
      <p style={{ color: '#64748b', fontSize: '18px', margin: 0, fontWeight: '400' }}>{subtitle}</p>
      <div style={{ width: '80px', height: '5px', backgroundColor: '#c9a84c', marginTop: '20px', borderRadius: '10px' }} />
    </div>
  )
}