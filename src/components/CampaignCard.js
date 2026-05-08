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
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        border: '1px solid #f1f5f9',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: '"Plus Jakarta Sans", sans-serif'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-8px)'
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(15, 45, 31, 0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'
      }}
    >
      {/* IMAGE - Fixed 16:9 Aspect Ratio */}
      <div style={{
        width: '100%',
        aspectRatio: '16 / 9',
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
        position: 'relative'
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
            backgroundColor: '#f1f5f9'
          }}>
            <span style={{ fontSize: '48px' }}>🕌</span>
          </div>
        )}
        
        {/* DAYS LEFT BADGE */}
        {campaign.status === 'ACTIVE' && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            padding: '6px 12px',
            borderRadius: '10px',
            fontSize: '11px',
            fontWeight: '800',
            color: '#1d6a4e',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            {daysLeft} HARI LAGI
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div style={{ padding: '24px' }}>

        {/* PREMISE TAG */}
        <div style={{
          fontSize: '10px',
          color: '#c9a84c',
          fontWeight: '800',
          marginBottom: '8px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase'
        }}>
          {campaign.premise?.name?.toLowerCase().startsWith(campaign.premise?.type?.toLowerCase()) 
            ? campaign.premise.name 
            : `${campaign.premise?.type} ${campaign.premise?.name}`}
        </div>

        {/* TITLE */}
        <h3 style={{
          fontSize: '18px',
          fontWeight: '900',
          color: '#0f2d1f',
          marginBottom: '20px',
          lineHeight: '1.3',
          letterSpacing: '-0.5px',
          height: '46px', // Ensures vertical alignment in grid
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {campaign.title}
        </h3>

        {/* PROGRESS BAR */}
        <div style={{
          backgroundColor: '#f1f5f9',
          borderRadius: '10px',
          height: '10px',
          marginBottom: '12px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: campaign.status === 'COMPLETED' ? '#c9a84c' : '#1d6a4e',
            borderRadius: '10px',
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>

        {/* STATS ROW */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#1d6a4e', lineHeight: '1' }}>
              {formatRM(campaign.collected_amount)}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', fontWeight: '500' }}>
              Sasaran {formatRM(campaign.target_amount)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#0f2d1f', lineHeight: '1' }}>
              {progress}%
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', fontWeight: '500' }}>
              Terkumpul
            </div>
          </div>
        </div>

        {/* ACTION BUTTON */}
        {campaign.status === 'ACTIVE' && (
          <button
            onClick={e => {
              e.stopPropagation()
              router.push(`/kempen/${campaign.id}`)
            }}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#1d6a4e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '800',
              boxShadow: '0 4px 12px rgba(29, 106, 78, 0.2)',
              transition: 'all 0.2s ease'
            }}
          >
            Derma Sekarang
          </button>
        )}

        {campaign.status === 'COMPLETED' && (
          <div style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#fefce8',
            color: '#c9a84c',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '800',
            textAlign: 'center',
            border: '1px solid rgba(201, 168, 76, 0.2)'
          }}>
            ✓ Sasaran Dicapai — Alhamdulillah
          </div>
        )}
      </div>
    </div>
  )
}