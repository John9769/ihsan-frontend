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
      <main style={{ backgroundColor: '#f8f7f4', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <Navbar />
        <div style={{
          maxWidth: '480px',
          margin: '80px auto',
          padding: '48px 40px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1d6a4e', marginBottom: '12px' }}>
            Permohonan Diterima
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
            Terima kasih. Permohonan anda sedang disemak oleh pihak pentadbir.
            Anda akan dihubungi setelah akaun diaktifkan.
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              background: '#1d6a4e',
              color: '#fff',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700'
            }}
          >
            Kembali ke Laman Utama
          </button>
        </div>
      </main>
    )
  }

  return (
    <main style={{ backgroundColor: '#f8f7f4', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: '640px', margin: '48px auto', padding: '0 24px 48px' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#1d6a4e',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            lineHeight: '48px',
            fontSize: '22px',
            marginBottom: '12px'
          }}>🕌</div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 8px' }}>
            Daftar Masjid / Surau
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Isi maklumat di bawah untuk mendaftarkan premis anda ke platform IHSAN
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '36px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
        }}>

          {/* SECTION: MAKLUMAT PREMIS */}
          <SectionTitle title="Maklumat Premis" />

          <FormRow>
            <FormField label="Jenis Premis" required>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="MASJID">Masjid</option>
                <option value="SURAU">Surau</option>
              </select>
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="Nama Penuh" required>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="cth: Masjid Al-Hidayah"
                required
                style={inputStyle}
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="Negeri" required>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                style={selectStyle}
              >
                <option value="">-- Pilih Negeri --</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Daerah" required>
              <input
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="cth: Seremban"
                required
                style={inputStyle}
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="Alamat Penuh" required>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="No, Jalan, Taman, Poskod, Bandar"
                required
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="No. Telefon" required>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="cth: 0612345678"
                required
                style={inputStyle}
              />
            </FormField>
          </FormRow>

          {/* SECTION: MAKLUMAT AKAUN */}
          <SectionTitle title="Maklumat Akaun Log Masuk" />

          <FormRow>
            <FormField label="Emel" required>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="emel@masjid.com"
                required
                style={inputStyle}
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="Kata Laluan" required>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 aksara"
                required
                style={inputStyle}
              />
            </FormField>
            <FormField label="Sahkan Kata Laluan" required>
              <input
                name="confirm_password"
                type="password"
                value={form.confirm_password}
                onChange={handleChange}
                placeholder="Ulang kata laluan"
                required
                style={inputStyle}
              />
            </FormField>
          </FormRow>

          {/* SECTION: MAKLUMAT BANK */}
          <SectionTitle title="Maklumat Bank (Untuk Penerimaan Derma)" />

          <FormRow>
            <FormField label="Nama Bank" required>
              <input
                name="bank_name"
                value={form.bank_name}
                onChange={handleChange}
                placeholder="cth: Maybank"
                required
                style={inputStyle}
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="No. Akaun Bank" required>
              <input
                name="bank_account_no"
                value={form.bank_account_no}
                onChange={handleChange}
                placeholder="cth: 1234567890"
                required
                style={inputStyle}
              />
            </FormField>
            <FormField label="Nama Pemilik Akaun" required>
              <input
                name="bank_account_name"
                value={form.bank_account_name}
                onChange={handleChange}
                placeholder="Nama seperti dalam buku bank"
                required
                style={inputStyle}
              />
            </FormField>
          </FormRow>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? '#9ca3af' : '#1d6a4e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: '700',
              marginTop: '8px'
            }}
          >
            {loading ? 'Menghantar...' : 'Hantar Permohonan'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '16px' }}>
            Sudah ada akaun?{' '}
            <span
              onClick={() => router.push('/login')}
              style={{ color: '#1d6a4e', fontWeight: '700', cursor: 'pointer' }}
            >
              Log Masuk
            </span>
          </p>

        </form>
      </div>
    </main>
  )
}

function SectionTitle({ title }) {
  return (
    <div style={{
      fontSize: '13px',
      fontWeight: '700',
      color: '#1d6a4e',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      borderBottom: '1px solid #e8e4dc',
      paddingBottom: '8px',
      marginBottom: '20px',
      marginTop: '28px'
    }}>
      {title}
    </div>
  )
}

function FormRow({ children }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${Array.isArray(children) ? children.length : 1}, 1fr)`,
      gap: '16px',
      marginBottom: '16px'
    }}>
      {children}
    </div>
  )
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '6px'
      }}>
        {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
      </label>
      {children}
    </div>
  )
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

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer'
}