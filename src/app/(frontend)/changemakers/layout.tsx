import './changemakers-list.css'
import './changemakers.css'

export default function ChangemakersLayout({ children }: { children: React.ReactNode }) {
  return <div className="changemakers-tailwind min-h-screen bg-white text-neutral-900">{children}</div>
}
