'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import API from '@/lib/api'

const STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
  'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah',
  'Sarawak', 'Selangor', 'Terengganu', 'Wilayah Persekutuan'
]

export default function Daftar() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    type: 'MASJID',
    name: '',
    state: '',
    district: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
    bank_name: '',
    bank_account_no: '',
    bank_account_name: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) {
      setError('Kata laluan tidak sepadan.')
      return
    }
    if (form.password.length < 8) {
      setError('Kata laluan mestilah sekurang-kurangnya 8 aksara.')
      return
    }
    setLoading(true)
    try {
      await API.post('/premises/register', {
        type: form.type,
        name: form.name,
        registration_no: '-',
        state: form.state,
        district: form.district,
        address: form.address,
        phone: form.phone,
        email: form.email,
        password: form.password,
        bank_name: form.bank_name,
        bank_account_no: form.bank_account_no,
        bank_account_name: form.bank_account_name
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Ralat berlaku. Sila cuba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main style={{ backgroundColor: '#f9f9f7', minHeight: '100vh', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
        <Navbar />
        <div style={{ maxWidth: '520px', margin: '0 auto', paddingTop: '200px', paddingLeft: '24px', paddingRight: '24px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '60px 40px',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
            textAlign: 'center',
            border: '1px solid rgba(29, 106, 78, 0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1d6a4e', marginBottom: '16px', letterSpacing: '-1px' }}>Permohonan Diterima</h2>
            <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.7', marginBottom: '32px' }}>JazakAllah Khair. Maklumat premis anda telah selamat diterima.</p>
            <button onClick={() => router.push('/')} style={{ background: '#1d6a4e', color: '#fff', border: 'none', padding: '16px 40px', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '800' }}>
              Kembali ke Laman Utama
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{ 
      backgroundColor: '#fdfdfc', 
      minHeight: '100vh', 
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      backgroundImage: 'linear-gradient(to bottom, #f0fdf4 0%, #fdfdfc 400px)' // Soft green glow at the top
    }}>
      <Navbar />

      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '180px', paddingBottom: '100px', paddingLeft: '24px', paddingRight: '24px' }}>

        {/* HEADER SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(29, 106, 78, 0.1)',
            border: '1px solid rgba(29, 106, 78, 0.05)'
          }}>
            {/* MODERN PNG ICON */}
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2143/2143825.png" 
              alt="Masjid Icon" 
              style={{ width: '45px', height: '45px', opacity: 0.9 }}
            />
          </div>
          
          <div style={{
            fontSize: '13px',
            color: '#c9a84c',
            fontWeight: '800',
            letterSpacing: '5px',
            marginBottom: '16px',
            textTransform: 'uppercase'
          }}>
            Pendaftaran Premis
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f2d1f', margin: '0 0 16px', letterSpacing: '-2px' }}>
            Daftar Masjid & Surau
          </h1>
          <p style={{ color: '#64748b', fontSize: '17px', maxWidth: '520px', margin: '0 auto', lineHeight: '1.6' }}>
            Sertai rangkaian platform IHSAN untuk menguruskan kutipan derma secara telus dan profesional.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          backgroundColor: '#ffffff',
          borderRadius: '30px',
          padding: '56px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.02)'
        }}>

          {/* SECTION 01 */}
          <SectionHeader number="01" title="Butiran Premis" />

          <FormRow>
            <FormField label="Jenis Premis" required>
              <select name="type" value={form.type} onChange={handleChange} style={selectStyle}>
                <option value="MASJID">Masjid</option>
                <option value="SURAU">Surau</option>
              </select>
            </FormField>
            <FormField label="Nama Penuh Masjid / Surau" required>
              <input name="name" value={form.name} onChange={handleChange} placeholder="cth: Masjid Al-Ikhlas" required style={inputStyle} />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="Negeri" required>
              <select name="state" value={form.state} onChange={handleChange} required style={selectStyle}>
                <option value="">-- Pilih Negeri --</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Daerah" required>
              <input name="district" value={form.district} onChange={handleChange} placeholder="cth: Shah Alam" required style={inputStyle} />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="Alamat Lengkap" required>
              <textarea name="address" value={form.address} onChange={handleChange} placeholder="No, Jalan, Taman, Poskod, Bandar" required rows={3} style={{ ...inputStyle, resize: 'none' }} />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="No. Telefon Rasmi" required>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="cth: 0312345678" required style={inputStyle} />
            </FormField>
          </FormRow>

          {/* SECTION 02 */}
          <SectionHeader number="02" title="Akses Pentadbir" />

          <FormRow>
            <FormField label="Alamat Emel" required>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="admin@masjid.com" required style={inputStyle} />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="Kata Laluan" required>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 8 aksara" required style={inputStyle} />
            </FormField>
            <FormField label="Sahkan Kata Laluan" required>
              <input name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} placeholder="Ulang semula" required style={inputStyle} />
            </FormField>
          </FormRow>

          {/* SECTION 03 */}
          <SectionHeader number="03" title="Butiran Perbankan" />

          <FormRow>
            <FormField label="Nama Bank" required>
              <input name="bank_name" value={form.bank_name} onChange={handleChange} placeholder="cth: Maybank Islamic" required style={inputStyle} />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="Nombor Akaun" required>
              <input name="bank_account_no" value={form.bank_account_no} onChange={handleChange} placeholder="cth: 5642XXXXXXXX" required style={inputStyle} />
            </FormField>
            <FormField label="Nama Pemegang Akaun" required>
              <input name="bank_account_name" value={form.bank_account_name} onChange={handleChange} placeholder="Nama mengikut penyata bank" required style={inputStyle} />
            </FormField>
          </FormRow>

          {error && (
            <div style={{ backgroundColor: '#fff1f2', border: '1px solid #ffe4e6', color: '#e11d48', padding: '16px', borderRadius: '14px', fontSize: '14px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '20px',
              backgroundColor: loading ? '#cbd5e1' : '#1d6a4e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '17px',
              fontWeight: '800',
              marginTop: '12px',
              boxShadow: loading ? 'none' : '0 15px 30px rgba(29, 106, 78, 0.25)',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Sedang Memproses...' : 'Daftar Premis Sekarang'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginTop: '28px', fontWeight: '500' }}>
            Sudah ada akaun?{' '}
            <span onClick={() => router.push('/login')} style={{ color: '#1d6a4e', fontWeight: '800', cursor: 'pointer' }}>
              Log Masuk Dashboard
            </span>
          </p>

        </form>
      </div>
    </main>
  )
}

function SectionHeader({ number, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '32px', marginTop: number === "01" ? "0" : "50px" }}>
      <div style={{ backgroundColor: '#f0fdf4', color: '#c9a84c', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '900', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
        {number}
      </div>
      <div style={{ fontSize: '15px', fontWeight: '800', color: '#1d6a4e', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ flex: 1, height: '1.5px', backgroundColor: '#f1f5f9' }} />
    </div>
  )
}

function FormRow({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Array.isArray(children) ? children.length : 1}, 1fr)`, gap: '24px', marginBottom: '24px' }}>
      {children}
    </div>
  )
}

function FormField({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', paddingLeft: '4px' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '16px 20px',
  border: '2px solid #f1f5f9',
  borderRadius: '14px',
  fontSize: '15px',
  color: '#0f172a',
  backgroundColor: '#f8fafc',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all 0.3s ease',
  fontFamily: 'inherit'
}

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer'
}