import type { ReactNode } from 'react'
import Image from 'next/image'

type MobileCardTextProps = {
  title: string
  description?: string
  meta?: string
  metaSecondary?: string
  metaLayout?: 'inline' | 'stacked'
  metaAvatarUrl?: string
  children?: ReactNode
}

export function MobileCardText({
  title,
  description,
  meta,
  metaSecondary,
  metaLayout = 'stacked',
  metaAvatarUrl,
  children,
}: MobileCardTextProps) {
  const hasMeta = Boolean(meta || metaSecondary)
  const useInlineMeta = metaLayout === 'inline' && Boolean(meta && metaSecondary)
  const hasFooter = hasMeta || Boolean(children)

  return (
    <div className="mobile-scroll-card__text">
      <div className="mobile-scroll-card__head">
        <h3 className="mobile-scroll-card__title">{title}</h3>
        <p className="mobile-scroll-card__desc">{description || ''}</p>
      </div>
      {hasFooter ? (
        <div className="mobile-scroll-card__meta-slot">
          {useInlineMeta ? (
            <div className="mobile-scroll-card__meta-row">
              <span className="mobile-scroll-card__meta-author">
                {metaAvatarUrl ? (
                  <Image
                    src={metaAvatarUrl}
                    alt=""
                    width={16}
                    height={16}
                    className="mobile-scroll-card__meta-avatar"
                  />
                ) : null}
                <span className="mobile-scroll-card__meta mobile-scroll-card__meta--left">
                  {metaSecondary}
                </span>
              </span>
              <span className="mobile-scroll-card__meta mobile-scroll-card__meta--right">
                {meta}
              </span>
            </div>
          ) : (
            <>
              {metaSecondary ? (
                <p className="mobile-scroll-card__meta mobile-scroll-card__meta--with-avatar">
                  {metaAvatarUrl ? (
                    <Image
                      src={metaAvatarUrl}
                      alt=""
                      width={16}
                      height={16}
                      className="mobile-scroll-card__meta-avatar"
                    />
                  ) : null}
                  <span>{metaSecondary}</span>
                </p>
              ) : null}
              {meta ? <p className="mobile-scroll-card__meta">{meta}</p> : null}
            </>
          )}
          {children}
        </div>
      ) : null}
    </div>
  )
}
