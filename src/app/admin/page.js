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
    <main style={{ backgroundColor: '#fdfdfc', minHeight: '100vh', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      <Navbar />
      <div style={{ paddingTop: '200px', textAlign: 'center', color: '#64748b', fontWeight: '800' }}>
        Memuatkan Panel Pengurusan...
      </div>
    </main>
  )

  return (
    <main style={{ backgroundColor: '#fcfbf9', minHeight: '100vh', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '140px', paddingBottom: '100px', paddingLeft: '24px', paddingRight: '24px' }}>

        {/* HEADER SECTION */}
        <div style={{ marginBottom: '48px', borderBottom: '1px solid #f1f5f9', paddingBottom: '32px' }}>
          <div style={{ fontSize: '12px', color: '#c9a84c', fontWeight: '800', letterSpacing: '4px', marginBottom: '12px', textTransform: 'uppercase' }}>
            Kawalan Super Admin
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#0f2d1f', margin: '0', letterSpacing: '-1.5px' }}>
            Pengurusan Platform
          </h1>
        </div>

        {/* EARNINGS STATS BAR */}
        {earnings && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '56px' }}>
            {[
              { label: 'Transaksi', value: earnings.total_transactions, color: '#0284c7' },
              { label: 'Jumlah Derma', value: formatRM(earnings.total_collected), color: '#0f2d1f' },
              { label: 'Bersih ke Masjid', value: formatRM(earnings.total_to_premises), color: '#1d6a4e' },
              { label: 'Pendapatan IHSAN', value: formatRM(earnings.platform_earnings), color: '#c9a84c' }
            ].map((stat, i) => (
              <div key={i} style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div style={{ display: 'flex', gap: '40px', marginBottom: '40px', borderBottom: '2px solid #f1f5f9' }}>
          {[
            { key: 'PREMISES', label: `Direktori Premis (${pending.length} Baru)` },
            { key: 'DONATIONS', label: 'Aliran Tunai Platform' },
            { key: 'BULK', label: 'Import Pukal' }
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

        {/* TAB 01: PREMISES DIRECTORY */}
        {activeTab === 'PREMISES' && (
          <div>
            {pending.length > 0 && (
              <div style={{ marginBottom: '48px' }}>
                <div style={{ fontSize: '13px', fontWeight: '900', color: '#ef4444', marginBottom: '20px', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }} />
                  MENUNGGU KELULUSAN
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {pending.map(p => (
                    <PremiseCard key={p.id} premise={p} onApprove={() => updateStatus(p.id, 'ACTIVE')} onReject={() => updateStatus(p.id, 'SUSPENDED')} formatRM={formatRM} />
                  ))}
                </div>
              </div>
            )}

            <div style={{ fontSize: '13px', fontWeight: '900', color: '#1d6a4e', marginBottom: '20px', letterSpacing: '1px' }}>DIREKTORI AKTIF</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {active.length === 0 ? <p style={{ color: '#94a3b8' }}>Tiada premis aktif.</p> : active.map(p => (
                <PremiseCard key={p.id} premise={p} onSuspend={() => updateStatus(p.id, 'SUSPENDED')} formatRM={formatRM} />
              ))}
            </div>

            {suspended.length > 0 && (
              <div style={{ marginTop: '48px' }}>
                <div style={{ fontSize: '13px', fontWeight: '900', color: '#94a3b8', marginBottom: '20px', letterSpacing: '1px' }}>AKAUN DIGANTUNG</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {suspended.map(p => (
                    <PremiseCard key={p.id} premise={p} onApprove={() => updateStatus(p.id, 'ACTIVE')} formatRM={formatRM} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 02: DONATION LEDGER */}
        {activeTab === 'DONATIONS' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  {['Penderma', 'Masjid/Surau', 'Jumlah', 'Platform Fee', 'Net ke Masjid', 'Tarikh'].map(h => (
                    <th key={h} style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donations.map((d, i) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }}>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontWeight: '800', color: '#0f2d1f', fontSize: '14px' }}>{d.donor_name}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{d.donor_phone}</div>
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{d.campaign?.premise?.name}</td>
                    <td style={{ padding: '20px 24px', fontSize: '14px', fontWeight: '800', color: '#0f2d1f' }}>{formatRM(d.amount_paid)}</td>
                    <td style={{ padding: '20px 24px', fontSize: '14px', fontWeight: '800', color: '#c9a84c' }}>RM 0.75</td>
                    <td style={{ padding: '20px 24px', fontSize: '14px', fontWeight: '800', color: '#1d6a4e' }}>{formatRM(d.net_to_premise)}</td>
                    <td style={{ padding: '20px 24px', fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>{new Date(d.created_at).toLocaleDateString('ms-MY')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 03: BULK IMPORT */}
        {activeTab === 'BULK' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '28px', padding: '48px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#0f2d1f', margin: '0 0 12px', letterSpacing: '-1px' }}>Import Direktori Nasional</h3>
            <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>Tampal data JSON direktori masjid untuk pendaftaran automatik. Kata laluan lalai: <strong>ihsan@2026</strong></p>

            <div style={{ backgroundColor: '#0f172a', borderRadius: '16px', padding: '24px', marginBottom: '24px', fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace', overflowX: 'auto', border: '1px solid #334155' }}>
              <div style={{ color: '#38bdf8', marginBottom: '8px' }}>// Contoh Format JSON</div>
              {`[{ "type": "MASJID", "name": "Masjid Al-Ikhlas", "state": "Selangor", "district": "Shah Alam", "email": "info@masjid.my", "bank_name": "Bank Islam", "bank_account_no": "123456", "bank_account_name": "Tabung Masjid" }]`}
            </div>

            <textarea
              value={bulkData}
              onChange={e => setBulkData(e.target.value)}
              placeholder="Tampal JSON di sini..."
              rows={10}
              style={{ width: '100%', padding: '20px', border: '2px solid #f1f5f9', borderRadius: '20px', fontSize: '14px', fontFamily: 'monospace', backgroundColor: '#f8fafc', outline: 'none', marginBottom: '24px', resize: 'vertical' }}
            />

            <button
              onClick={handleBulkImport}
              disabled={bulkLoading || !bulkData.trim()}
              style={{ padding: '16px 40px', backgroundColor: bulkLoading ? '#94a3b8' : '#1d6a4e', color: '#ffffff', border: 'none', borderRadius: '16px', cursor: 'pointer', fontSize: '15px', fontWeight: '800', boxShadow: '0 10px 25px rgba(29, 106, 78, 0.2)' }}
            >
              {bulkLoading ? 'Memproses Data...' : 'Mulakan Import Pukal'}
            </button>

            {bulkResult && (
              <div style={{ marginTop: '24px', padding: '24px', backgroundColor: '#f0fdf4', borderRadius: '16px', border: '1px solid #dcfce7', color: '#166534' }}>
                <div style={{ fontWeight: '800', marginBottom: '8px' }}>{bulkResult.message}</div>
                {bulkResult.imported?.length > 0 && <div style={{ fontSize: '13px' }}>✓ Berjaya: {bulkResult.imported.join(', ')}</div>}
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
    <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '28px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: '900', padding: '4px 10px', borderRadius: '30px', backgroundColor: premise.type === 'MASJID' ? '#eff6ff' : '#fff1f2', color: premise.type === 'MASJID' ? '#1d4ed8' : '#e11d48' }}>{premise.type}</span>
          <span style={{ fontSize: '18px', fontWeight: '900', color: '#0f2d1f', letterSpacing: '-0.5px' }}>{premise.name}</span>
        </div>
        <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>{premise.district}, {premise.state} • {premise.phone}</div>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{premise.bank_name}: {premise.bank_account_no} ({premise.bank_account_name})</div>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        {onApprove && <button onClick={onApprove} style={{ padding: '10px 24px', background: '#1d6a4e', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>Lulus</button>}
        {onReject && <button onClick={onReject} style={{ padding: '10px 24px', background: 'transparent', color: '#ef4444', border: '1.5px solid #ef4444', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>Tolak</button>}
        {onSuspend && <button onClick={onSuspend} style={{ padding: '10px 24px', background: 'transparent', color: '#94a3b8', border: '1.5px solid #f1f5f9', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>Gantung</button>}
      </div>
    </div>
  )
}