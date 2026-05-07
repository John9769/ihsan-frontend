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
    <main style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      <Navbar />

      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: '680px',
        overflow: 'hidden',
        backgroundColor: '#051610'
      }}>
        <video
          autoPlay
          muted
          playsInline
          loop={false} // Stops the AI from talking non-stop
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 15%',
            opacity: 0.9
          }}
          src="https://res.cloudinary.com/dugbnq9oz/video/upload/v1778066710/ihsan_msps5v.mp4"
        />
        
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(5,22,16,0.95) 0%, rgba(5,22,16,0.6) 45%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 80px',
          paddingTop: '60px'
        }}>
          <div style={{ maxWidth: '650px' }}>
            <div style={{
              fontSize: '12px',
              color: '#c9a84c',
              fontWeight: '800',
              letterSpacing: '5px',
              marginBottom: '20px'
            }}>
              PLATFORM INFAQ DIGITAL
            </div>
            <h1 style={{
              fontSize: '60px',
              fontWeight: '900',
              color: '#ffffff',
              lineHeight: '1',
              margin: '0 0 24px 0',
              letterSpacing: '-2px'
            }}>
              Salurkan Ihsan<br />
              <span style={{ color: '#c9a84c' }}>Terus & Telus</span>
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#e2e8f0',
              marginBottom: '40px',
              lineHeight: '1.6',
              maxWidth: '520px'
            }}>
              Menghubungkan anda dengan pelbagai misi kebajikan dan inisiatif masjid di seluruh Malaysia tanpa perantara.
            </p>

            {/* SEARCH BAR */}
            <div style={{
              display: 'flex',
              background: '#ffffff',
              padding: '6px',
              borderRadius: '14px',
              maxWidth: '480px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              marginBottom: '20px'
            }}>
              <input 
                type="text" 
                placeholder="Cari masjid, misi bantuan atau lokasi..." 
                style={{
                  flex: 1,
                  border: 'none',
                  padding: '0 20px',
                  outline: 'none',
                  fontSize: '15px'
                }}
              />
              <button style={{
                background: '#1d6a4e',
                color: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer'
              }}>
                Cari
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{
        backgroundColor: '#1d6a4e',
        padding: '24px 80px',
        display: 'flex',
        gap: '60px',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {['Masjid Disahkan', 'Wang Terus Ke Akaun', 'Laporan Telus', 'Sistem Selamat'].map((text, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '5px', height: '5px', backgroundColor: '#c9a84c', borderRadius: '50%' }} />
            <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px' }}>{text}</span>
          </div>
        ))}
      </section>

      {/* MAIN CONTAINER */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 40px' }}>

        {/* SECTION: LIVE REEL (KEMPEN BAHARU) */}
        {newCampaigns.length > 0 && (
          <section style={{ marginBottom: '80px' }}>
            <SectionHeader
              badge="LIVE REEL"
              badgeColor="#3b82f6"
              title="Misi Terbaru"
              subtitle="Peluang terawal untuk menyumbang kepada inisiatif murni"
              isLive={true}
            />
            {/* HORIZONTAL SCROLL CONTAINER */}
            <div style={{ 
              display: 'flex', 
              overflowX: 'auto', 
              gap: '24px', 
              paddingBottom: '20px',
              scrollbarWidth: 'none', // Hide scrollbar for Chrome/Safari below
              msOverflowStyle: 'none'
            }}>
              {newCampaigns.map(c => (
                <div key={c.id} style={{ minWidth: '340px', flexShrink: 0 }}>
                  <CampaignCard campaign={c} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: ACTIVE GRID */}
        <section id="kempen-aktif" style={{ marginBottom: '80px' }}>
          <SectionHeader
            badge="AKTIF"
            badgeColor="#1d6a4e"
            title="Inisiatif Ummah"
            subtitle="Sokong kempen yang sedang berjalan untuk komuniti"
          />
          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px' }}>Memuatkan...</p>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '32px' 
            }}>
              {activeCampaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          )}
        </section>

        {/* SECTION: COMPLETED */}
        {completedCampaigns.length > 0 && (
          <section>
            <SectionHeader
              badge="ALHAMDULILLAH"
              badgeColor="#c9a84c"
              title="Kempen Berjaya"
              subtitle="Hasil sumbangan anda yang telah mencapai sasaran"
            />
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '32px',
              opacity: 0.8
            }}>
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
        borderTop: '1px solid rgba(201, 168, 76, 0.1)'
      }}>
        <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '28px', marginBottom: '8px', letterSpacing: '3px' }}>IHSAN</div>
        <div style={{ color: '#c9a84c', fontWeight: '700', fontSize: '12px', marginBottom: '40px', letterSpacing: '2px' }}>MENERAJUI KEBAJIKAN DIGITAL</div>
        <div style={{ maxWidth: '600px', margin: '0 auto', fontSize: '14px', lineHeight: '1.8', opacity: 0.7 }}>
          Platform ini memudahkan urusan infaq dan sedekah anda terus kepada pihak masjid dan surau secara telus dan amanah.
        </div>
        <div style={{ marginTop: '40px', fontSize: '12px' }}>© 2026 IHSAN MALAYSIA. HAK CIPTA TERPELIHARA.</div>
      </footer>
    </main>
  )
}

function SectionHeader({ badge, badgeColor, title, subtitle, isLive }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <span style={{
          backgroundColor: badgeColor,
          color: '#fff',
          fontSize: '10px',
          fontWeight: '900',
          padding: '4px 12px',
          borderRadius: '30px',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {isLive && <span style={{ width: '6px', height: '6px', backgroundColor: '#fff', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />}
          {badge}
        </span>
        <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#051610', margin: 0, letterSpacing: '-1.5px' }}>{title}</h2>
      </div>
      <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>{subtitle}</p>
      <div style={{ width: '60px', height: '4px', backgroundColor: '#c9a84c', marginTop: '16px', borderRadius: '10px' }} />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}} />
    </div>
  )
}