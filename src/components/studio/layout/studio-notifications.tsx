'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { getStudioNotifications, type StudioNotificationItem } from '@/app/(studio)/studio/auth-actions'
import { formatRelativeTime } from '@/lib/studio/format'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function StudioNotifications() {
  const [items, setItems] = useState<StudioNotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const data = await getStudioNotifications()
      setItems(data.items)
      setUnreadCount(data.unreadCount)
    })
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" aria-hidden />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-muted-foreground">No recent activity</p>
        ) : (
          items.map((item) => (
            <DropdownMenuItem key={item.id} asChild className="flex flex-col items-start gap-0.5 py-2">
              <Link href={item.href}>
                <span className="line-clamp-1 text-sm font-medium">{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.meta}</span>
                <time className="font-mono text-[10px] text-muted-foreground">
                  {formatRelativeTime(item.timestamp)}
                </time>
              </Link>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/studio/contact" className={cn('w-full justify-center text-center text-sm font-medium')}>
            View all
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
