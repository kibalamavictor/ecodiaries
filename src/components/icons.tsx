export function MenuIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function SearchIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  )
}

export function ArrowRightIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  )
}

export function ClockIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  )
}

export function PlayIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

export function SocialIcons() {
  return (
    <>
      <a
        href="https://www.instagram.com/ecodiaries__/"
        aria-label="Instagram"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="4" y="4" width="16" height="16" rx="5" />
          <circle cx="12" cy="12" r="3.3" />
          <circle cx="16.6" cy="7.4" r=".6" fill="currentColor" stroke="none" />
        </svg>
      </a>
      <a
        href="https://x.com/ecodiaries__"
        aria-label="X"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      </a>
      <a
        href="https://www.linkedin.com/company/ecodiaries"
        aria-label="LinkedIn"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M8 10.5V16M8 8v.01M12 16v-3.2c0-1.2.8-2 2-2s2 .8 2 2V16" />
        </svg>
      </a>
    </>
  )
}
