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
    <main style={{ backgroundColor: '#f9f9f7', minHeight: '100vh', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      <Navbar />

      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: '720px',
        overflow: 'hidden',
        backgroundColor: '#051610'
      }}>
        <video
          autoPlay
          muted
          playsInline
          loop={false}
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
            <div style={{ fontSize: '12px', color: '#c9a84c', fontWeight: '800', letterSpacing: '5px', marginBottom: '20px' }}>
              PLATFORM INFAQ DIGITAL
            </div>
            <h1 style={{ fontSize: '64px', fontWeight: '900', color: '#ffffff', lineHeight: '1', margin: '0 0 24px 0', letterSpacing: '-2px' }}>
              Salurkan Ihsan<br />
              <span style={{ color: '#c9a84c' }}>Terus & Telus</span>
            </h1>
            <p style={{ fontSize: '19px', color: '#e2e8f0', marginBottom: '40px', lineHeight: '1.6', maxWidth: '520px', opacity: 0.9 }}>
              Menghubungkan anda dengan pelbagai misi kebajikan dan inisiatif masjid di seluruh Malaysia secara langsung.
            </p>

            {/* FIXED SEARCH BAR "HANDSHAKE" */}
            <div style={{
              display: 'flex',
              background: '#ffffff',
              borderRadius: '16px', // Rounded outer
              maxWidth: '500px',
              height: '60px', // Fixed height for perfect handshake
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              overflow: 'hidden', // Ensures button corners match wrapper
              marginBottom: '20px'
            }}>
              <input 
                type="text" 
                placeholder="Cari masjid, misi atau lokasi..." 
                style={{
                  flex: 1,
                  border: 'none',
                  padding: '0 25px',
                  outline: 'none',
                  fontSize: '16px',
                  color: '#1e293b'
                }}
              />
              <button style={{
                background: '#1d6a4e',
                color: '#fff',
                border: 'none',
                padding: '0 35px',
                height: '100%', // Fills the wrapper height perfectly
                fontSize: '16px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}>
                Cari
              </button>
            </div>
            <div style={{ color: '#94a3b8', fontSize: '13px', display: 'flex', gap: '15px', paddingLeft: '5px' }}>
              <span>Popular: Masjid Nabawi</span>
              <span>•</span>
              <span>Bantuan Iftar</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{ backgroundColor: '#1d6a4e', padding: '24px 80px', display: 'flex', gap: '60px', justifyContent: 'center' }}>
        {['Masjid Disahkan', 'Wang Terus Ke Akaun', 'Laporan Telus', 'Sistem Selamat'].map((text, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '6px', height: '6px', backgroundColor: '#c9a84c', borderRadius: '50%' }} />
            <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px' }}>{text}</span>
          </div>
        ))}
      </section>

      {/* MAIN CONTAINER */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 40px' }}>

        {/* SECTION: LIVE REEL - ALIGNED WITH GRID */}
        {newCampaigns.length > 0 && (
          <section style={{ marginBottom: '90px' }}>
            <SectionHeader
              badge="LIVE REEL"
              badgeColor="#3b82f6"
              title="Misi Terbaru"
              subtitle="Peluang terawal untuk menyumbang kepada inisiatif murni"
              isLive={true}
            />
            <div style={{ 
              display: 'flex', 
              overflowX: 'auto', 
              gap: '32px', // Matches Grid Gap
              paddingBottom: '30px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {newCampaigns.map(c => (
                <div key={c.id} style={{ width: '380px', flexShrink: 0 }}> {/* Fixed width for "Tally" */}
                  <CampaignCard campaign={c} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: ACTIVE GRID */}
        <section id="kempen-aktif" style={{ marginBottom: '90px' }}>
          <SectionHeader
            badge="AKTIF"
            badgeColor="#1d6a4e"
            title="Inisiatif Ummah"
            subtitle="Sokong kempen yang sedang berjalan untuk komuniti"
          />
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px', color: '#1d6a4e', fontWeight: '700' }}>Memuatkan inisiatif...</div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', // Match Reel width
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px', opacity: 0.85 }}>
              {completedCampaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          </section>
        )}

      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#051610', color: '#9ca3af', textAlign: 'center', padding: '80px 40px', borderTop: '1px solid rgba(201, 168, 76, 0.1)' }}>
        <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '32px', marginBottom: '8px', letterSpacing: '4px' }}>IHSAN</div>
        <div style={{ color: '#c9a84c', fontWeight: '700', fontSize: '13px', marginBottom: '40px', letterSpacing: '2px' }}>MENERAJUI KEBAJIKAN DIGITAL</div>
        <div style={{ maxWidth: '650px', margin: '0 auto', fontSize: '15px', lineHeight: '1.8', opacity: 0.8 }}>
          Platform telus yang menghubungkan para penyumbang terus dengan institusi masjid untuk impak kebajikan yang lebih nyata.
        </div>
        <div style={{ marginTop: '50px', fontSize: '12px', color: '#334155' }}>© 2026 IHSAN MALAYSIA. HAK CIPTA TERPELIHARA.</div>
      </footer>
    </main>
  )
}

function SectionHeader({ badge, badgeColor, title, subtitle, isLive }) {
  return (
    <div style={{ marginBottom: '45px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
        <h2 style={{ fontSize: '38px', fontWeight: '900', color: '#051610', margin: 0, letterSpacing: '-1.5px' }}>{title}</h2>
        <span style={{
          backgroundColor: badgeColor,
          color: '#fff',
          fontSize: '10px',
          fontWeight: '900',
          padding: '5px 15px',
          borderRadius: '50px',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {isLive && <span style={{ width: '7px', height: '7px', backgroundColor: '#fff', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />}
          {badge}
        </span>
      </div>
      <p style={{ color: '#64748b', fontSize: '18px', margin: 0, fontWeight: '400' }}>{subtitle}</p>
      <div style={{ width: '70px', height: '5px', backgroundColor: '#c9a84c', marginTop: '18px', borderRadius: '10px' }} />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.2; } 100% { opacity: 1; } }
      `}} />
    </div>
  )
}