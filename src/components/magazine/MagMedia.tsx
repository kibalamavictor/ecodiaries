import Image from 'next/image'

type MagMediaProps = {
  src: string
  alt?: string
  ratio?: string
  priority?: boolean
}

export function MagMedia({ src, alt = '', ratio = '16 / 7', priority = false }: MagMediaProps) {
  return (
    <div className="mag-media" style={{ aspectRatio: ratio }}>
      <Image src={src} alt={alt} fill sizes="100vw" priority={priority} />
    </div>
  )
}
