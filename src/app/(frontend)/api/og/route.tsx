import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'EcoDiaries'
  const category = searchParams.get('category') || searchParams.get('type') || 'Climate Stories'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 64,
          background: 'linear-gradient(135deg, #0B3E1F 0%, #014104 50%, #58001E 100%)',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 600, color: '#B6F101', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 }}>
          {category}
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15, maxWidth: 900 }}>{title}</div>
        <div style={{ fontSize: 22, marginTop: 32, opacity: 0.85 }}>EcoDiaries</div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
