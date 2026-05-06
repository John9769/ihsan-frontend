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
  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE')
  const completedCampaigns = campaigns.filter(c => c.status === 'COMPLETED')

  if (loading) return (
    <main style={{ backgroundColor: '#f8f7f4', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      <p style={{ textAlign: 'center', padding: '80px', color: '#6b7280' }}>Memuatkan...</p>
    </main>
  )

  return (
    <main style={{ backgroundColor: '#f8f7f4', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>

        {/* HEADER */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 4px' }}>
              Dashboard
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
              Selamat datang, {localStorage.getItem('ihsan_name')}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              background: '#1d6a4e',
              color: '#fff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700'
            }}
          >
            + Kempen Baru
          </button>
        </div>

        {/* STATS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Jumlah Terkumpul', value: formatRM(totalCollected), color: '#1d6a4e' },
            { label: 'Kempen Aktif', value: activeCampaigns.length, color: '#3b82f6' },
            { label: 'Kempen Selesai', value: completedCampaigns.length, color: '#c9a84c' }
          ].map((stat, i) => (
            <div key={i} style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '20px 24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #e8e4dc'
            }}>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>{stat.label}</div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '2px solid #e8e4dc',
          paddingBottom: '0'
        }}>
          {[
            { key: 'CAMPAIGNS', label: 'Kempen Saya' },
            { key: 'DONATIONS', label: 'Senarai Derma' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid #1d6a4e' : '2px solid transparent',
                backgroundColor: 'transparent',
                color: activeTab === tab.key ? '#1d6a4e' : '#6b7280',
                fontWeight: activeTab === tab.key ? '700' : '500',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '-2px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CAMPAIGNS TAB */}
        {activeTab === 'CAMPAIGNS' && (
          <div>
            {campaigns.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e8e4dc'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🕌</div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Belum ada kempen. Cipta kempen pertama anda!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {campaigns.map(c => {
                  const progress = Math.min(
                    Math.round((c.collected_amount / c.target_amount) * 100), 100
                  )
                  const daysLeft = Math.max(
                    0, Math.ceil((new Date(c.end_date) - new Date()) / (1000 * 60 * 60 * 24))
                  )
                  const targetReached = c.collected_amount >= c.target_amount

                  return (
                    <div key={c.id} style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '20px 24px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      border: `1px solid ${targetReached && c.status === 'ACTIVE' ? '#c9a84c' : '#e8e4dc'}`
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px'
                      }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>
                            {c.title}
                          </div>
                          <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
                            {new Date(c.start_date).toLocaleDateString('ms-MY')} —{' '}
                            {new Date(c.end_date).toLocaleDateString('ms-MY')}
                          </div>
                        </div>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          backgroundColor: c.status === 'ACTIVE' ? '#dcfce7' : '#fef3c7',
                          color: c.status === 'ACTIVE' ? '#166534' : '#92400e'
                        }}>
                          {c.status === 'ACTIVE' ? 'AKTIF' : 'SELESAI'}
                        </span>
                      </div>

                      {/* PROGRESS */}
                      <div style={{
                        backgroundColor: '#f0ede8',
                        borderRadius: '999px',
                        height: '8px',
                        marginBottom: '8px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${progress}%`,
                          height: '100%',
                          backgroundColor: c.status === 'COMPLETED' ? '#c9a84c' : '#1d6a4e',
                          borderRadius: '999px'
                        }} />
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>
                          <strong style={{ color: '#1d6a4e' }}>{formatRM(c.collected_amount)}</strong>
                          {' '}daripada {formatRM(c.target_amount)} ({progress}%)
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {c.status === 'ACTIVE' && (
                            <>
                              <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                                {daysLeft} hari lagi
                              </span>
                              <button
                                onClick={() => endCampaign(c.id)}
                                style={{
                                  padding: '6px 14px',
                                  backgroundColor: targetReached ? '#c9a84c' : '#ffffff',
                                  color: targetReached ? '#ffffff' : '#dc2626',
                                  border: `1px solid ${targetReached ? '#c9a84c' : '#dc2626'}`,
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '700'
                                }}
                              >
                                {targetReached ? '✓ Tamat & Selesai' : 'Tamat Kempen'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {targetReached && c.status === 'ACTIVE' && (
                        <div style={{
                          marginTop: '10px',
                          padding: '8px 12px',
                          backgroundColor: '#fef3c7',
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: '#92400e',
                          fontWeight: '600'
                        }}>
                          🎉 Alhamdulillah! Sasaran telah dicapai. Sila tamatkan kempen ini.
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* DONATIONS TAB */}
        {activeTab === 'DONATIONS' && (
          <div>
            {donations.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e8e4dc'
              }}>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Belum ada derma diterima.</p>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e8e4dc',
                overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f7f4' }}>
                      {['Penderma', 'Telefon', 'Kempen', 'Jumlah', 'Bersih ke Masjid', 'Tarikh'].map(h => (
                        <th key={h} style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#6b7280',
                          borderBottom: '1px solid #e8e4dc'
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((d, i) => (
                      <tr key={d.id} style={{
                        borderBottom: '1px solid #f0ede8',
                        backgroundColor: i % 2 === 0 ? '#ffffff' : '#fafaf9'
                      }}>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                          {d.donor_name}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6b7280' }}>
                          {d.donor_phone}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6b7280' }}>
                          {d.campaign?.title}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>
                          {formatRM(d.amount_paid)}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '700', color: '#1d6a4e' }}>
                          {formatRM(d.net_to_premise)}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: '#9ca3af' }}>
                          {new Date(d.created_at).toLocaleDateString('ms-MY')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE CAMPAIGN MODAL */}
      {showCreate && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '520px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>
                Cipta Kempen Baru
              </h2>
              <button
                onClick={() => setShowCreate(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >✕</button>
            </div>

            {createSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                <p style={{ fontWeight: '700', color: '#1d6a4e' }}>Kempen berjaya dicipta!</p>
              </div>
            ) : (
              <form onSubmit={handleCreate}>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Tajuk Kempen *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="cth: Baik Pulih Bumbung Masjid"
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Tujuan Kempen *</label>
                  <textarea
                    value={form.purpose}
                    onChange={e => setForm({ ...form, purpose: e.target.value })}
                    placeholder="Huraikan tujuan kempen ini secara terperinci..."
                    required
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Sasaran Kutipan (RM) *</label>
                  <input
                    type="number"
                    min="100"
                    value={form.target_amount}
                    onChange={e => setForm({ ...form, target_amount: e.target.value })}
                    placeholder="cth: 50000"
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <label style={labelStyle}>Tarikh Mula *</label>
                    <input
                      type="date"
                      value={form.start_date}
                      onChange={e => setForm({ ...form, start_date: e.target.value })}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Tarikh Tamat *</label>
                    <input
                      type="date"
                      value={form.end_date}
                      onChange={e => setForm({ ...form, end_date: e.target.value })}
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>Gambar Kempen</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={imageRef}
                    onChange={e => setForm({ ...form, image: e.target.files[0] })}
                    style={{ ...inputStyle, padding: '8px' }}
                  />
                </div>

                {createError && (
                  <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    marginBottom: '16px'
                  }}>
                    {createError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: creating ? '#9ca3af' : '#1d6a4e',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: creating ? 'not-allowed' : 'pointer',
                    fontSize: '15px',
                    fontWeight: '700'
                  }}
                >
                  {creating ? 'Sedang Mencipta...' : 'Cipta Kempen'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '6px'
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1.5px solid #e8e4dc',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#1a1a1a',
  backgroundColor: '#fafaf9',
  outline: 'none',
  boxSizing: 'border-box'
}