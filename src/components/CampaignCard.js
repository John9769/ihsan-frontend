'use client'
import { useRouter } from 'next/navigation'

export default function CampaignCard({ campaign }) {
  const router = useRouter()

  const progress = Math.min(
    Math.round((campaign.collected_amount / campaign.target_amount) * 100),
    100
  )

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(campaign.end_date) - new Date()) / (1000 * 60 * 60 * 24))
  )

  const formatRM = (amount) =>
    'RM ' + parseFloat(amount).toLocaleString('ms-MY', { minimumFractionDigits: 2 })

  return (
    <div
      onClick={() => router.push(`/kempen/${campaign.id}`)}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        border: '1px solid #e8e4dc',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)'
      }}
    >
      {/* IMAGE */}
      <div style={{
        width: '100%',
        height: '180px',
        backgroundColor: '#e8e4dc',
        overflow: 'hidden'
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
            backgroundColor: '#f0ede8'
          }}>
            <span style={{ fontSize: '40px' }}>🕌</span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div style={{ padding: '16px' }}>

        {/* PREMISE NAME */}
        <div style={{
          fontSize: '11px',
          color: '#1d6a4e',
          fontWeight: '700',
          marginBottom: '4px',
          letterSpacing: '0.5px'
        }}>
          {campaign.premise?.type} {campaign.premise?.name}
        </div>

        {/* TITLE */}
        <div style={{
          fontSize: '15px',
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '8px',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {campaign.title}
        </div>

        {/* PROGRESS BAR */}
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
            backgroundColor: campaign.status === 'COMPLETED' ? '#c9a84c' : '#1d6a4e',
            borderRadius: '999px',
            transition: 'width 0.5s ease'
          }} />
        </div>

        {/* STATS ROW */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#1d6a4e' }}>
              {formatRM(campaign.collected_amount)}
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af' }}>
              daripada {formatRM(campaign.target_amount)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#1a1a1a' }}>
              {progress}%
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af' }}>
              {campaign.status === 'COMPLETED' ? 'Selesai ✓' : `${daysLeft} hari lagi`}
            </div>
          </div>
        </div>

        {/* DONATE BUTTON */}
        {campaign.status === 'ACTIVE' && (
          <button
            onClick={e => {
              e.stopPropagation()
              router.push(`/kempen/${campaign.id}`)
            }}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#1d6a4e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '700'
            }}
          >
            Derma Sekarang
          </button>
        )}

        {campaign.status === 'COMPLETED' && (
          <div style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#fef3c7',
            color: '#c9a84c',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '700',
            textAlign: 'center'
          }}>
            ✓ Sasaran Dicapai — Alhamdulillah
          </div>
        )}
      </div>
    </div>
  )
}