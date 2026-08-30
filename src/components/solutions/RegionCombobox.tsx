'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { RegionFilterModal, type RegionFilterSection } from '@/components/solutions/RegionFilterModal'
import { cn } from '@/lib/utils'

type RegionComboboxProps = {
  regions?: string[]
  sections?: RegionFilterSection[]
  value: string | 'all'
  onChange: (value: string | 'all') => void
  variant?: 'default' | 'atlas'
}

export function RegionCombobox({ regions = [], sections, value, onChange, variant = 'default' }: RegionComboboxProps) {
  const [open, setOpen] = useState(false)
  const isAtlas = variant === 'atlas'

  if (isAtlas) {
    return (
      <>
        <button
          type="button"
          className="filter-pill atlas-region-pill active"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          {value === 'all' ? 'All Regions' : value}
        </button>
        <RegionFilterModal
          open={open}
          onClose={() => setOpen(false)}
          regions={regions}
          sections={sections}
          value={value}
          onSelect={(next) => {
            onChange(next)
            setOpen(false)
          }}
          title="Filter by region"
        />
      </>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 w-full items-center justify-between gap-2 whitespace-nowrap rounded-md border border-border bg-white px-3 py-2 text-sm shadow-sm sm:w-56"
      >
        <span className="truncate">{value === 'all' ? 'All Regions' : value}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </button>
      {open ? (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-border bg-white shadow-lg sm:w-64">
          <Command>
            <CommandInput placeholder="Search region…" />
            <CommandList>
              <CommandEmpty>No region found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="all"
                  onSelect={() => {
                    onChange('all')
                    setOpen(false)
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === 'all' ? 'opacity-100' : 'opacity-0')} />
                  All Regions
                </CommandItem>
                {regions.map((region) => (
                  <CommandItem
                    key={region}
                    value={region}
                    onSelect={() => {
                      onChange(region)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn('mr-2 h-4 w-4', value === region ? 'opacity-100' : 'opacity-0')} />
                    {region}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      ) : null}
    </div>
  )
}
