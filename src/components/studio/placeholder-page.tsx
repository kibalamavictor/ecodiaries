import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function StudioPlaceholderPage({ title }: { title: string }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-20 text-center">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Coming soon</p>
      <h1 className="mt-2 font-heading text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">This section is next on the build list.</p>
      <Button asChild variant="outline" className="mt-8">
        <Link href="/studio">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to dashboard
        </Link>
      </Button>
    </div>
  )
}
