'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import API from '@/lib/api'

export default function Admin() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('PREMISES')
  const [premises, setPremises] = useState([])
  const [donations, setDonations] = useState([])
  const [earnings, setEarnings] = useState(null)
  const [bulkData, setBulkData] = useState('')
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkResult, setBulkResult] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('ihsan_token')
    const role = localStorage.getItem('ihsan_role')
    if (!token || role !== 'SUPER_ADMIN') {
      router.push('/login')
      return
    }
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [premRes, donRes, earnRes] = await Promise.all([
        API.get('/premises'),
        API.get('/donations/all'),
        API.get('/donations/earnings')
      ])
      setPremises(premRes.data)
      setDonations(donRes.data)
      setEarnings(earnRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/premises/${id}/status`, { status })
      fetchAll()
    } catch (err) {
      alert('Ralat berlaku.')
    }
  }

  const handleBulkImport = async () => {
    setBulkLoading(true)
    setBulkResult(null)
    try {
      const parsed = JSON.parse(bulkData)
      const res = await API.post('/premises/bulk-import', { premises: parsed })
      setBulkResult(res.data)
      fetchAll()
    } catch (err) {
      setBulkResult({ message: err.response?.data?.message || 'Format JSON tidak sah.' })
    } finally {
      setBulkLoading(false)
    }
  }

  const formatRM = (amount) =>
    'RM ' + parseFloat(amount || 0).toLocaleString('ms-MY', { minimumFractionDigits: 2 })

  const pending = premises.filter(p => p.status === 'PENDING')
  const active = premises.filter(p => p.status === 'ACTIVE')
  const suspended = premises.filter(p => p.status === 'SUSPENDED')

  if (loading) return (
    <main style={{ backgroundColor: '#f8f7f4', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      <p style={{ textAlign: 'center', padding: '80px', color: '#6b7280' }}>Memuatkan...</p>
    </main>
  )

  return (
    <main style={{ backgroundColor: '#f8f7f4', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 4px' }}>
            Admin Panel
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            Pengurusan Platform IHSAN
          </p>
        </div>

        {/* EARNINGS STATS */}
        {earnings && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {[
              { label: 'Jumlah Transaksi', value: earnings.total_transactions, color: '#3b82f6' },
              { label: 'Jumlah Derma', value: formatRM(earnings.total_collected), color: '#1a1a1a' },
              { label: 'Bersih ke Masjid', value: formatRM(earnings.total_to_premises), color: '#1d6a4e' },
              { label: 'Pendapatan IHSAN', value: formatRM(earnings.platform_earnings), color: '#c9a84c' }
            ].map((stat, i) => (
              <div key={i} style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #e8e4dc'
              }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>{stat.label}</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* TABS */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '2px solid #e8e4dc'
        }}>
          {[
            { key: 'PREMISES', label: `Premis (${pending.length} Pending)` },
            { key: 'DONATIONS', label: 'Semua Derma' },
            { key: 'BULK', label: 'Import Direktori' }
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

        {/* PREMISES TAB */}
        {activeTab === 'PREMISES' && (
          <div>
            {/* PENDING */}
            {pending.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#dc2626',
                  marginBottom: '12px',
                  letterSpacing: '1px'
                }}>
                  MENUNGGU KELULUSAN ({pending.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pending.map(p => (
                    <PremiseCard
                      key={p.id}
                      premise={p}
                      onApprove={() => updateStatus(p.id, 'ACTIVE')}
                      onReject={() => updateStatus(p.id, 'SUSPENDED')}
                      formatRM={formatRM}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ACTIVE */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#1d6a4e',
                marginBottom: '12px',
                letterSpacing: '1px'
              }}>
                AKTIF ({active.length})
              </div>
              {active.length === 0 ? (
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>Tiada premis aktif.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {active.map(p => (
                    <PremiseCard
                      key={p.id}
                      premise={p}
                      onSuspend={() => updateStatus(p.id, 'SUSPENDED')}
                      formatRM={formatRM}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* SUSPENDED */}
            {suspended.length > 0 && (
              <div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#9ca3af',
                  marginBottom: '12px',
                  letterSpacing: '1px'
                }}>
                  DIGANTUNG ({suspended.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {suspended.map(p => (
                    <PremiseCard
                      key={p.id}
                      premise={p}
                      onApprove={() => updateStatus(p.id, 'ACTIVE')}
                      formatRM={formatRM}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* DONATIONS TAB */}
        {activeTab === 'DONATIONS' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e8e4dc',
            overflow: 'hidden'
          }}>
            {donations.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Belum ada derma.
              </p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f7f4' }}>
                    {['Penderma', 'Telefon', 'Kempen', 'Masjid/Surau', 'Jumlah', 'Bersih', 'Tarikh'].map(h => (
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
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#1a1a1a' }}>
                        {d.donor_name}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>
                        {d.donor_phone}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>
                        {d.campaign?.title}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>
                        {d.campaign?.premise?.name}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '700', color: '#1a1a1a' }}>
                        {formatRM(d.amount_paid)}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '700', color: '#1d6a4e' }}>
                        {formatRM(d.net_to_premise)}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#9ca3af' }}>
                        {new Date(d.created_at).toLocaleDateString('ms-MY')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* BULK IMPORT TAB */}
        {activeTab === 'BULK' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #e8e4dc'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 8px' }}>
              Import Direktori Masjid/Surau
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
              Tampal senarai JSON dari direktori Pengarah. Setiap premis akan didaftarkan secara automatik dengan kata laluan lalai <strong>ihsan@2026</strong>.
            </p>

            <div style={{
              backgroundColor: '#f8f7f4',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
              fontSize: '12px',
              color: '#6b7280',
              fontFamily: 'monospace'
            }}>
              {`[
  {
    "type": "MASJID",
    "name": "Masjid Al-Hidayah",
    "state": "Negeri Sembilan",
    "district": "Seremban",
    "address": "Jalan Rasah, 70300 Seremban",
    "phone": "0612345678",
    "email": "masjid.hidayah@gmail.com",
    "bank_name": "Maybank",
    "bank_account_no": "1234567890",
    "bank_account_name": "Masjid Al-Hidayah"
  }
]`}
            </div>

            <textarea
              value={bulkData}
              onChange={e => setBulkData(e.target.value)}
              placeholder="Tampal JSON di sini..."
              rows={10}
              style={{
                width: '100%',
                padding: '12px',
                border: '1.5px solid #e8e4dc',
                borderRadius: '8px',
                fontSize: '13px',
                fontFamily: 'monospace',
                backgroundColor: '#fafaf9',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '16px',
                resize: 'vertical'
              }}
            />

            <button
              onClick={handleBulkImport}
              disabled={bulkLoading || !bulkData.trim()}
              style={{
                padding: '12px 24px',
                backgroundColor: bulkLoading ? '#9ca3af' : '#1d6a4e',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: bulkLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '700'
              }}
            >
              {bulkLoading ? 'Sedang Import...' : 'Import Sekarang'}
            </button>

            {bulkResult && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: bulkResult.errors?.length > 0 ? '#fef3c7' : '#f0fdf4',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#1a1a1a'
              }}>
                <div style={{ fontWeight: '700', marginBottom: '8px' }}>{bulkResult.message}</div>
                {bulkResult.imported?.length > 0 && (
                  <div style={{ color: '#1d6a4e' }}>
                    ✓ Berjaya: {bulkResult.imported.join(', ')}
                  </div>
                )}
                {bulkResult.errors?.length > 0 && (
                  <div style={{ color: '#dc2626', marginTop: '4px' }}>
                    ✗ Gagal: {bulkResult.errors.map(e => e.name).join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

function PremiseCard({ premise, onApprove, onReject, onSuspend, formatRM }) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '20px 24px',
      border: '1px solid #e8e4dc',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '20px',
              backgroundColor: premise.type === 'MASJID' ? '#dbeafe' : '#fce7f3',
              color: premise.type === 'MASJID' ? '#1d4ed8' : '#9d174d'
            }}>
              {premise.type}
            </span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>
              {premise.name}
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>
            {premise.district}, {premise.state} • {premise.phone} • {premise.email}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
            {premise.address}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
            Bank: {premise.bank_name} — {premise.bank_account_no} ({premise.bank_account_name})
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
          {onApprove && (
            <button
              onClick={onApprove}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1d6a4e',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '700'
              }}
            >
              Lulus
            </button>
          )}
          {onReject && (
            <button
              onClick={onReject}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ffffff',
                color: '#dc2626',
                border: '1px solid #dc2626',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '700'
              }}
            >
              Tolak
            </button>
          )}
          {onSuspend && (
            <button
              onClick={onSuspend}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ffffff',
                color: '#9ca3af',
                border: '1px solid #e8e4dc',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '700'
              }}
            >
              Gantung
            </button>
          )}
        </div>
      </div>
    </div>
  )
}