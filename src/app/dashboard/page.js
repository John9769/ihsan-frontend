'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import API from '@/lib/api'

export default function Dashboard() {
  const router = useRouter()
  const [premise, setPremise] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('CAMPAIGNS')
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState(false)
  const imageRef = useRef(null)

  const [form, setForm] = useState({
    title: '',
    purpose: '',
    target_amount: '',
    start_date: '',
    end_date: '',
    image: null
  })

  useEffect(() => {
    const token = localStorage.getItem('ihsan_token')
    const role = localStorage.getItem('ihsan_role')
    if (!token || role !== 'PREMISE') {
      router.push('/login')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [campRes, donRes] = await Promise.all([
        API.get('/campaigns/mine'),
        API.get('/donations/mine')
      ])
      setCampaigns(campRes.data)
      setDonations(donRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    setCreateError('')
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('purpose', form.purpose)
      formData.append('target_amount', form.target_amount)
      formData.append('start_date', form.start_date)
      formData.append('end_date', form.end_date)
      if (form.image) formData.append('image', form.image)

      await API.post('/campaigns', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setCreateSuccess(true)
      setForm({ title: '', purpose: '', target_amount: '', start_date: '', end_date: '', image: null })
      if (imageRef.current) imageRef.current.value = ''
      fetchData()
      setTimeout(() => {
        setShowCreate(false)
        setCreateSuccess(false)
      }, 2000)
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Ralat berlaku.')
    } finally {
      setCreating(false)
    }
  }

  const endCampaign = async (id) => {
    if (!confirm('Adakah anda pasti ingin menamatkan kempen ini?')) return
    try {
      await API.patch(`/campaigns/${id}/status`, { status: 'COMPLETED' })
      fetchData()
    } catch (err) {
      alert('Ralat berlaku.')
    }
  }

  const formatRM = (amount) =>
    'RM ' + parseFloat(amount || 0).toLocaleString('ms-MY', { minimumFractionDigits: 2 })

  const totalCollected = campaigns.reduce((sum, c) => sum + (c.collected_amount || 0), 0)
  const activeCount = campaigns.filter(c => c.status === 'ACTIVE').length
  const completedCount = campaigns.filter(c => c.status === 'COMPLETED').length

  if (loading) return (
    <main style={{ backgroundColor: '#fcfbf9', minHeight: '100vh', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      <Navbar />
      <div style={{ paddingTop: '200px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>
        Memuatkan data Dashboard...
      </div>
    </main>
  )

  return (
    <main style={{ backgroundColor: '#fdfdfc', minHeight: '100vh', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', paddingTop: '120px', paddingBottom: '100px', paddingLeft: '24px', paddingRight: '24px' }}>

        {/* TOP BAR */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '40px',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '24px'
        }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f2d1f', margin: '0 0 4px', letterSpacing: '-1.5px' }}>
              Dashboard
            </h1>
            <p style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>
              Selamat datang, <span style={{ color: '#1d6a4e', fontWeight: '700' }}>{localStorage.getItem('ihsan_name')}</span>
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              background: '#1d6a4e',
              color: '#fff',
              border: 'none',
              padding: '14px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '800',
              boxShadow: '0 10px 20px rgba(29, 106, 78, 0.2)'
            }}
          >
            + Kempen Baru
          </button>
        </div>

        {/* STATS ROW */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {[
            { label: 'Jumlah Terkumpul', value: formatRM(totalCollected), color: '#1d6a4e', bg: '#f0fdf4' },
            { label: 'Kempen Aktif', value: activeCount, color: '#0284c7', bg: '#f0f9ff' },
            { label: 'Kempen Selesai', value: completedCount, color: '#c9a84c', bg: '#fefce8' }
          ].map((stat, i) => (
            <div key={i} style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* TABS MENU */}
        <div style={{
          display: 'flex',
          gap: '32px',
          marginBottom: '32px',
          borderBottom: '2px solid #f1f5f9'
        }}>
          {[
            { key: 'CAMPAIGNS', label: 'Kempen Saya' },
            { key: 'DONATIONS', label: 'Senarai Derma' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 4px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === tab.key ? '3px solid #1d6a4e' : '3px solid transparent',
                color: activeTab === tab.key ? '#1d6a4e' : '#94a3b8',
                fontWeight: '800',
                cursor: 'pointer',
                fontSize: '15px',
                marginBottom: '-2px',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        {activeTab === 'CAMPAIGNS' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {campaigns.length === 0 ? (
              <EmptyState icon="🕌" msg="Belum ada kempen. Mulakan kempen pertama anda hari ini." />
            ) : (
              campaigns.map(c => {
                const progress = Math.min(Math.round((c.collected_amount / c.target_amount) * 100), 100)
                const daysLeft = Math.max(0, Math.ceil((new Date(c.end_date) - new Date()) / (1000 * 60 * 60 * 24)))
                const targetReached = c.collected_amount >= c.target_amount

                return (
                  <div key={c.id} style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    padding: '28px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                    border: `1px solid ${targetReached && c.status === 'ACTIVE' ? '#c9a84c' : '#f1f5f9'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f2d1f', margin: '0 0 4px' }}>{c.title}</h3>
                        <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
                          Tempoh: {new Date(c.start_date).toLocaleDateString('ms-MY')} — {new Date(c.end_date).toLocaleDateString('ms-MY')}
                        </p>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '6px 14px',
                        borderRadius: '30px',
                        letterSpacing: '0.5px',
                        backgroundColor: c.status === 'ACTIVE' ? '#f0fdf4' : '#fefce8',
                        color: c.status === 'ACTIVE' ? '#166534' : '#92400e'
                      }}>
                        {c.status === 'ACTIVE' ? 'SEDANG BERJALAN' : 'SELESAI'}
                      </span>
                    </div>

                    {/* PROGRESS BAR */}
                    <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '10px', marginBottom: '16px', overflow: 'hidden' }}>
                      <div style={{ width: `${progress}%`, height: '100%', backgroundColor: c.status === 'COMPLETED' ? '#c9a84c' : '#1d6a4e', borderRadius: '10px', transition: 'width 1s ease-out' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                        <strong style={{ color: '#0f2d1f', fontSize: '16px' }}>{formatRM(c.collected_amount)}</strong> daripada {formatRM(c.target_amount)} ({progress}%)
                      </div>
                      
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        {c.status === 'ACTIVE' && (
                          <>
                            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>{daysLeft} hari lagi</span>
                            <button
                              onClick={() => endCampaign(c.id)}
                              style={{
                                padding: '10px 20px',
                                background: targetReached ? '#c9a84c' : 'transparent',
                                color: targetReached ? '#ffffff' : '#ef4444',
                                border: `1.5px solid ${targetReached ? '#c9a84c' : '#ef4444'}`,
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '800',
                                transition: 'all 0.2s'
                              }}
                            >
                              {targetReached ? '✓ Tamat Kempen' : 'Tamatkan'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        ) : (
          /* DONATIONS LIST */
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  {['Penderma', 'Kempen', 'Jumlah', 'Penerimaan Bersih', 'Tarikh'].map(h => (
                    <th key={h} style={{ padding: '18px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donations.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Tiada rekod derma ditemui.</td></tr>
                ) : (
                  donations.map((d, i) => (
                    <tr key={d.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }}>
                      <td style={{ padding: '18px 24px' }}>
                        <div style={{ fontWeight: '800', color: '#0f2d1f', fontSize: '14px' }}>{d.donor_name}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{d.donor_phone}</div>
                      </td>
                      <td style={{ padding: '18px 24px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{d.campaign?.title}</td>
                      <td style={{ padding: '18px 24px', fontSize: '14px', fontWeight: '800', color: '#0f2d1f' }}>{formatRM(d.amount_paid)}</td>
                      <td style={{ padding: '18px 24px', fontSize: '14px', fontWeight: '800', color: '#1d6a4e' }}>{formatRM(d.net_to_premise)}</td>
                      <td style={{ padding: '18px 24px', fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>{new Date(d.created_at).toLocaleDateString('ms-MY')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE MODAL - APPLE STYLE */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 45, 31, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '24px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '28px', padding: '40px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0f2d1f', letterSpacing: '-1px' }}>Kempen Baru</h2>
              <button onClick={() => setShowCreate(false)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: '#64748b', fontWeight: '800' }}>✕</button>
            </div>

            {createSuccess ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
                <p style={{ fontSize: '18px', fontWeight: '800', color: '#1d6a4e' }}>Kempen Berjaya Dicipta!</p>
              </div>
            ) : (
              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Tajuk Kempen</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="cth: Infaq Jumaat" required style={inputStyle} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Tujuan & Huraian</label>
                  <textarea value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} placeholder="Huraikan tujuan kempen..." required rows={3} style={{ ...inputStyle, resize: 'none' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Sasaran Kutipan (RM)</label>
                  <input type="number" value={form.target_amount} onChange={e => setForm({ ...form, target_amount: e.target.value })} placeholder="50000" required style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={labelStyle}>Tarikh Mula</label>
                    <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Tarikh Tamat</label>
                    <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} required style={inputStyle} />
                  </div>
                </div>
                <div style={{ marginBottom: '32px' }}>
                  <label style={labelStyle}>Poster Kempen</label>
                  <input type="file" accept="image/*" ref={imageRef} onChange={e => setForm({ ...form, image: e.target.files[0] })} style={{ ...inputStyle, padding: '12px' }} />
                </div>

                <button type="submit" disabled={creating} style={{
                  width: '100%', padding: '18px', backgroundColor: creating ? '#94a3b8' : '#1d6a4e', color: '#ffffff', border: 'none', borderRadius: '16px', cursor: 'pointer', fontSize: '16px', fontWeight: '800', boxShadow: '0 10px 25px rgba(29, 106, 78, 0.2)'
                }}>
                  {creating ? 'Mencipta Kempen...' : 'Lancarkan Kempen'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

function EmptyState({ icon, msg }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 40px', backgroundColor: '#ffffff', borderRadius: '24px', border: '2px dashed #f1f5f9' }}>
      <div style={{ fontSize: '50px', marginBottom: '16px' }}>{icon}</div>
      <p style={{ color: '#94a3b8', fontSize: '15px', fontWeight: '600' }}>{msg}</p>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }
const inputStyle = { width: '100%', padding: '14px 16px', border: '2px solid #f1f5f9', borderRadius: '12px', fontSize: '15px', backgroundColor: '#f8fafc', outline: 'none', boxSizing: 'border-box' }