'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import API from '@/lib/api'

export default function KempenDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDonate, setShowDonate] = useState(false)
  const [donateForm, setDonateForm] = useState({
    donor_name: '',
    donor_phone: '',
    donor_email: '',
    amount_paid: ''
  })
  const [donating, setDonating] = useState(false)
  const [donateError, setDonateError] = useState('')
  const [donateSuccess, setDonateSuccess] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get(`/campaigns/${id}`)
        setCampaign(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const handleDonate = async (e) => {
    e.preventDefault()
    if (parseFloat(donateForm.amount_paid) < 10) {
      setDonateError('Minimum derma adalah RM10.00')
      return
    }
    setDonating(true)
    try {
      await API.post('/donations', {
        campaign_id: id,
        ...donateForm,
        amount_paid: parseFloat(donateForm.amount_paid)
      })
      setDonateSuccess(true)
      const res = await API.get(`/campaigns/${id}`)
      setCampaign(res.data)
    } catch (err) {
      setDonateError(err.response?.data?.message || 'Ralat berlaku.')
    } finally {
      setDonating(false)
    }
  }

  const formatRM = (amount) =>
    'RM ' + parseFloat(amount).toLocaleString('ms-MY', { minimumFractionDigits: 2 })

  const progress = campaign
    ? Math.min(Math.round((campaign.collected_amount / campaign.target_amount) * 100), 100)
    : 0

  const daysLeft = campaign
    ? Math.max(0, Math.ceil((new Date(campaign.end_date) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0

  if (loading) return (
    <main style={{ backgroundColor: '#f8f7f4', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      <p style={{ textAlign: 'center', padding: '80px', color: '#6b7280' }}>Memuatkan...</p>
    </main>
  )

  if (!campaign) return (
    <main style={{ backgroundColor: '#f8f7f4', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      <p style={{ textAlign: 'center', padding: '80px', color: '#dc2626' }}>Kempen tidak dijumpai.</p>
    </main>
  )

  return (
    <main style={{ backgroundColor: '#f8f7f4', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: '800px', margin: '48px auto', padding: '0 24px 48px' }}>

        {/* BACK */}
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#1d6a4e',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '24px',
            padding: 0
          }}
        >
          ← Kembali
        </button>

        {/* IMAGE */}
        <div style={{
          width: '100%',
          height: '320px',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '32px',
          backgroundColor: '#e8e4dc'
        }}>
          {campaign.image_url ? (
            <img
              src={campaign.image_url}
              alt={campaign.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px'
            }}>🕌</div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>

          {/* LEFT */}
          <div>
            <div style={{
              fontSize: '12px',
              color: '#1d6a4e',
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              {campaign.premise?.type} {campaign.premise?.name} • {campaign.premise?.state}
            </div>

            <h1 style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#1a1a1a',
              margin: '0 0 16px'
            }}>
              {campaign.title}
            </h1>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid #e8e4dc'
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                TUJUAN KEMPEN
              </div>
              <p style={{
                color: '#1a1a1a',
                fontSize: '15px',
                lineHeight: '1.7',
                margin: 0
              }}>
                {campaign.purpose}
              </p>
            </div>

            {/* DONATIONS LIST */}
            {campaign.donations && campaign.donations.length > 0 && (
              <div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#6b7280',
                  marginBottom: '12px'
                }}>
                  PENDERMA TERKINI
                </div>
                {campaign.donations.slice(0, 5).map((d, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    border: '1px solid #e8e4dc'
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        {d.donor_name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {new Date(d.created_at).toLocaleDateString('ms-MY')}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#1d6a4e'
                    }}>
                      {formatRM(d.amount_paid)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — STICKY DONATE BOX */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            border: '1px solid #e8e4dc',
            alignSelf: 'start',
            position: 'sticky',
            top: '80px'
          }}>
            {/* PROGRESS */}
            <div style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#1d6a4e',
              marginBottom: '4px'
            }}>
              {formatRM(campaign.collected_amount)}
            </div>
            <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '12px' }}>
              daripada sasaran {formatRM(campaign.target_amount)}
            </div>

            <div style={{
              backgroundColor: '#f0ede8',
              borderRadius: '999px',
              height: '10px',
              marginBottom: '12px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: campaign.status === 'COMPLETED' ? '#c9a84c' : '#1d6a4e',
                borderRadius: '999px'
              }} />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a1a' }}>
                  {progress}%
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>Dicapai</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a1a' }}>
                  {campaign.status === 'COMPLETED' ? '✓' : daysLeft}
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                  {campaign.status === 'COMPLETED' ? 'Selesai' : 'Hari Lagi'}
                </div>
              </div>
            </div>

            {/* FEE NOTICE */}
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '12px',
              color: '#166534',
              marginBottom: '16px',
              lineHeight: '1.5'
            }}>
              💡 Setiap derma RM10 → <strong>RM8.25 terus ke masjid</strong><br />
              (Yuran platform RM0.75 + gateway RM1.00)
            </div>

            {campaign.status === 'ACTIVE' && !showDonate && (
              <button
                onClick={() => setShowDonate(true)}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#1d6a4e',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '700'
                }}
              >
                Derma Sekarang
              </button>
            )}

            {campaign.status === 'COMPLETED' && (
              <div style={{
                backgroundColor: '#fef3c7',
                color: '#c9a84c',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: '14px'
              }}>
                ✓ Sasaran Dicapai — Alhamdulillah
              </div>
            )}

            {/* DONATE FORM */}
            {showDonate && !donateSuccess && (
              <form onSubmit={handleDonate}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Nama Anda *</label>
                  <input
                    value={donateForm.donor_name}
                    onChange={e => setDonateForm({ ...donateForm, donor_name: e.target.value })}
                    placeholder="Nama penuh"
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>No. Telefon *</label>
                  <input
                    value={donateForm.donor_phone}
                    onChange={e => setDonateForm({ ...donateForm, donor_phone: e.target.value })}
                    placeholder="0123456789"
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Emel (Pilihan)</label>
                  <input
                    value={donateForm.donor_email}
                    onChange={e => setDonateForm({ ...donateForm, donor_email: e.target.value })}
                    placeholder="emel@contoh.com"
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Jumlah Derma (RM) *</label>
                  <input
                    type="number"
                    min="10"
                    value={donateForm.amount_paid}
                    onChange={e => setDonateForm({ ...donateForm, amount_paid: e.target.value })}
                    placeholder="Minimum RM10"
                    required
                    style={inputStyle}
                  />
                </div>

                {donateError && (
                  <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    marginBottom: '12px'
                  }}>
                    {donateError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={donating}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: donating ? '#9ca3af' : '#c9a84c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: donating ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}
                >
                  {donating ? 'Sedang Diproses...' : 'Sahkan Derma'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowDonate(false)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #e8e4dc',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Batal
                </button>
              </form>
            )}

            {donateSuccess && (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🤲</div>
                <div style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#1d6a4e',
                  marginBottom: '4px'
                }}>
                  JazakAllah Khair
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  Derma anda telah berjaya direkodkan
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '4px'
}

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: '1.5px solid #e8e4dc',
  borderRadius: '8px',
  fontSize: '13px',
  color: '#1a1a1a',
  backgroundColor: '#fafaf9',
  outline: 'none',
  boxSizing: 'border-box'
}