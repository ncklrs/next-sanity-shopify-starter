import { SearchIcon } from '@sanity/icons'
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Stack,
  Text,
  TextInput
} from '@sanity/ui'
import { useCallback, useState } from 'react'
import type { StringInputProps } from 'sanity'
import { set, unset } from 'sanity'

// Available icons - these match the exports from src/components/icons.tsx
// The value stored is the base name (e.g., "sparkles") which maps to "SparklesIcon"
const AVAILABLE_ICONS = [
  // Popular / Common
  { name: 'sparkles', label: 'Sparkles', category: 'popular' },
  { name: 'heart', label: 'Heart', category: 'popular' },
  { name: 'star', label: 'Star', category: 'popular' },
  { name: 'check', label: 'Check', category: 'popular' },
  { name: 'zap', label: 'Zap', category: 'popular' },
  { name: 'rocket', label: 'Rocket', category: 'popular' },
  { name: 'shield', label: 'Shield', category: 'popular' },
  { name: 'globe', label: 'Globe', category: 'popular' },

  // Commerce
  { name: 'shoppingCart', label: 'Shopping Cart', category: 'commerce' },
  { name: 'creditCard', label: 'Credit Card', category: 'commerce' },
  { name: 'package', label: 'Package', category: 'commerce' },
  { name: 'truck', label: 'Truck', category: 'commerce' },

  // Communication
  { name: 'mail', label: 'Mail', category: 'communication' },
  { name: 'messageSquare', label: 'Message', category: 'communication' },
  { name: 'bell', label: 'Bell', category: 'communication' },

  // Media & Content
  { name: 'image', label: 'Image', category: 'media' },
  { name: 'video', label: 'Video', category: 'media' },
  { name: 'play', label: 'Play', category: 'media' },
  { name: 'fileText', label: 'Document', category: 'media' },
  { name: 'quote', label: 'Quote', category: 'media' },

  // Interface
  { name: 'grid', label: 'Grid', category: 'interface' },
  { name: 'layers', label: 'Layers', category: 'interface' },
  { name: 'code', label: 'Code', category: 'interface' },
  { name: 'settings', label: 'Settings', category: 'interface' },
  { name: 'search', label: 'Search', category: 'interface' },
  { name: 'menu', label: 'Menu', category: 'interface' },

  // Navigation
  { name: 'arrowRight', label: 'Arrow Right', category: 'navigation' },
  { name: 'arrowLeft', label: 'Arrow Left', category: 'navigation' },
  { name: 'chevronRight', label: 'Chevron Right', category: 'navigation' },
  { name: 'chevronLeft', label: 'Chevron Left', category: 'navigation' },
  { name: 'chevronDown', label: 'Chevron Down', category: 'navigation' },
  { name: 'chevronUp', label: 'Chevron Up', category: 'navigation' },
  { name: 'x', label: 'Close', category: 'navigation' },

  // Business
  { name: 'users', label: 'Users', category: 'business' },
  { name: 'building', label: 'Building', category: 'business' },
  { name: 'barChart', label: 'Bar Chart', category: 'business' },
  { name: 'award', label: 'Award', category: 'business' },
  { name: 'database', label: 'Database', category: 'business' },

  // Design
  { name: 'type', label: 'Typography', category: 'design' },
  { name: 'paintbrush', label: 'Paintbrush', category: 'design' },
  { name: 'mousePointer', label: 'Cursor', category: 'design' },

  // Utility
  { name: 'plus', label: 'Plus', category: 'utility' },
  { name: 'minus', label: 'Minus', category: 'utility' },
  { name: 'trash', label: 'Trash', category: 'utility' },
  { name: 'helpCircle', label: 'Help', category: 'utility' },
  { name: 'clock', label: 'Clock', category: 'utility' },
  { name: 'puzzle', label: 'Puzzle', category: 'utility' },
] as const

type IconInfo = typeof AVAILABLE_ICONS[number]

// SVG paths for each icon (simplified versions for preview)
const ICON_PATHS: Record<string, string> = {
  sparkles: 'M12 3l1.9 5.8a2 2 0 001.3 1.3L21 12l-5.8 1.9a2 2 0 00-1.3 1.3L12 21l-1.9-5.8a2 2 0 00-1.3-1.3L3 12l5.8-1.9a2 2 0 001.3-1.3L12 3z',
  heart: 'M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 000-7.8z',
  star: 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2 1.2-6.8-5-4.9 6.9-1L12 2z',
  check: 'M20 6L9 17 4 12',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  rocket: 'M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 00-2.9-.1zM12 15l-3-3a22 22 0 012-4A12.9 12.9 0 0122 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 01-4 2zM9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
  globe: 'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
  shoppingCart: 'M9 21a1 1 0 100-2 1 1 0 000 2zM20 21a1 1 0 100-2 1 1 0 000 2zM1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6',
  creditCard: 'M1 4h22v16H1zM1 10h22',
  package: 'M16.5 9.4l-9-5.2M21 16V8a2 2 0 00-1-1.7l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.7l7 4a2 2 0 002 0l7-4a2 2 0 001-1.7zM3.3 7l8.7 5 8.7-5M12 22V12',
  truck: 'M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  mail: 'M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6',
  messageSquare: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  bell: 'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0',
  image: 'M3 3h18v18H3zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5-11 11',
  video: 'M23 7l-7 5 7 5V7zM1 5h15v14H1z',
  play: 'M5 3l14 9-14 9V3z',
  fileText: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  quote: 'M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  layers: 'M12 2l-10 5 10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.9 2.8l-.1-.1a1.7 1.7 0 00-2.8 1.2V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.9l.1-.1a1.7 1.7 0 00-.3-2.8H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.9-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.9l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.4-4.4',
  menu: 'M3 12h18M3 6h18M3 18h18',
  arrowRight: 'M5 12h14M12 5l7 7-7 7',
  arrowLeft: 'M19 12H5M12 19l-7-7 7-7',
  chevronRight: 'M9 18l6-6-6-6',
  chevronLeft: 'M15 18l-6-6 6-6',
  chevronDown: 'M6 9l6 6 6-6',
  chevronUp: 'M18 15l-6-6-6 6',
  x: 'M18 6L6 18M6 6l12 12',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8',
  building: 'M4 2h16v20H4zM9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01',
  barChart: 'M12 20V10M18 20V4M6 20v-4',
  award: 'M12 1a7 7 0 100 14 7 7 0 000-14zM8.2 13.9L7 23l5-3 5 3-1.2-9.1',
  database: 'M12 2c5 0 9 1.3 9 3s-4 3-9 3-9-1.3-9-3 4-3 9-3zM21 12c0 1.7-4 3-9 3s-9-1.3-9-3M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5',
  type: 'M4 7V4h16v3M9 20h6M12 4v16',
  paintbrush: 'M18.4 2.6l-4.4 4.4-1.6-1.6a2 2 0 00-2.8 0L8 7l9 9 1.6-1.6a2 2 0 000-2.8L17 10l4.4-4.4a2.1 2.1 0 10-3-3zM9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7M14.5 17.5L4.5 15',
  mousePointer: 'M3 3l7.1 17 2.5-7.4 7.4-2.5L3 3zM13 13l6 6',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  trash: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6',
  helpCircle: 'M12 22a10 10 0 100-20 10 10 0 000 20zM9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01',
  clock: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2',
  puzzle: 'M19.4 7.9a1 1 0 00.3.9l1.6 1.6a2.4 2.4 0 010 3.4l-1.6 1.6a1 1 0 01-.8.3c-.5-.1-.8-.5-1-.9a2.5 2.5 0 10-3.2 3.2c.4.2.9.5.9 1a1 1 0 01-.3.8l-1.6 1.6a2.4 2.4 0 01-3.4 0l-1.6-1.6a1 1 0 00-.9-.3c-.5.1-.8.5-1 .9a2.5 2.5 0 11-3.2-3.2c.4-.2.9-.5.9-1a1 1 0 00-.3-.9l-1.6-1.6a2.4 2.4 0 010-3.4l1.6-1.6a1 1 0 01.8-.3c.5.1.8.5 1 .9a2.5 2.5 0 103.2-3.2c-.4-.2-.9-.5-.9-1a1 1 0 01.3-.8l1.6-1.6a2.4 2.4 0 013.4 0l1.6 1.6c.2.2.6.3.9.3.5-.1.8-.5 1-.9a2.5 2.5 0 113.2 3.2c-.4.2-.9.5-.9 1z',
}

// Simple icon preview component
function IconPreview({ name, size = 24 }: { name: string; size?: number }) {
  const path = ICON_PATHS[name]
  if (!path) return null

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  )
}

interface IconCardProps {
  icon: IconInfo
  isSelected: boolean
  onClick: () => void
}

function IconCard({ icon, isSelected, onClick }: IconCardProps) {
  return (
    <Card
      padding={3}
      radius={2}
      shadow={1}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        border: isSelected ? '2px solid var(--card-focus-ring-color)' : '2px solid transparent',
        transition: 'all 0.15s ease'
      }}
      tone={isSelected ? 'primary' : 'default'}
    >
      <Flex direction="column" align="center" gap={2}>
        <Box style={{ color: isSelected ? 'var(--card-focus-ring-color)' : 'currentColor' }}>
          <IconPreview name={icon.name} size={28} />
        </Box>
        <Text size={0} muted={!isSelected} align="center">
          {icon.label}
        </Text>
      </Flex>
    </Card>
  )
}

interface IconPickerDialogProps {
  value?: string
  onSelect: (iconName: string) => void
  onClear: () => void
  onClose: () => void
}

function IconPickerDialog({ value, onSelect, onClear, onClose }: IconPickerDialogProps) {
  const [searchValue, setSearchValue] = useState('')

  const filteredIcons = AVAILABLE_ICONS.filter(icon => {
    const search = searchValue.toLowerCase()
    return (
      icon.name.toLowerCase().includes(search) ||
      icon.label.toLowerCase().includes(search) ||
      icon.category.toLowerCase().includes(search)
    )
  })

  // Group by category
  const categories = ['popular', 'commerce', 'communication', 'media', 'interface', 'navigation', 'business', 'design', 'utility'] as const
  const categoryLabels: Record<string, string> = {
    popular: 'Popular',
    commerce: 'Commerce',
    communication: 'Communication',
    media: 'Media & Content',
    interface: 'Interface',
    navigation: 'Navigation',
    business: 'Business',
    design: 'Design',
    utility: 'Utility',
  }

  return (
    <Dialog
      header="Select Icon"
      id="icon-picker-dialog"
      onClose={onClose}
      zOffset={1000}
      width={1}
    >
      <Box padding={4} style={{ borderBottom: '1px solid var(--card-border-color)' }}>
        <Stack space={3}>
          <TextInput
            fontSize={2}
            onChange={event => setSearchValue(event.currentTarget.value)}
            padding={3}
            radius={2}
            placeholder="Search icons..."
            value={searchValue}
            autoFocus
            icon={SearchIcon}
          />
          {value && (
            <Button
              text="Clear selection"
              mode="ghost"
              tone="critical"
              onClick={() => {
                onClear()
                onClose()
              }}
            />
          )}
        </Stack>
      </Box>
      <Box padding={4} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {categories.map(category => {
          const categoryIcons = filteredIcons.filter(icon => icon.category === category)
          if (categoryIcons.length === 0) return null

          return (
            <Box key={category} marginBottom={5}>
              <Text size={1} weight="semibold" muted style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {categoryLabels[category]}
              </Text>
              <Grid columns={[4, 5, 6]} gap={3} marginTop={3}>
                {categoryIcons.map(icon => (
                  <IconCard
                    key={icon.name}
                    icon={icon}
                    isSelected={value === icon.name}
                    onClick={() => {
                      onSelect(icon.name)
                      onClose()
                    }}
                  />
                ))}
              </Grid>
            </Box>
          )
        })}
      </Box>
    </Dialog>
  )
}

export function IconPickerInput(props: StringInputProps) {
  const { value, onChange } = props
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSelect = useCallback((iconName: string) => {
    onChange(set(iconName))
  }, [onChange])

  const handleClear = useCallback(() => {
    onChange(unset())
  }, [onChange])

  const selectedIcon = AVAILABLE_ICONS.find(icon => icon.name === value)

  return (
    <Stack space={3}>
      <Card
        padding={4}
        radius={2}
        shadow={1}
        style={{ cursor: 'pointer' }}
        onClick={() => setDialogOpen(true)}
      >
        <Flex align="center" gap={3}>
          {value && selectedIcon ? (
            <>
              <Box style={{ color: 'var(--card-focus-ring-color)' }}>
                <IconPreview name={value} size={32} />
              </Box>
              <Stack space={2}>
                <Text size={2} weight="medium">{selectedIcon.label}</Text>
                <Text size={1} muted>Click to change</Text>
              </Stack>
            </>
          ) : (
            <Flex align="center" gap={3} style={{ width: '100%' }}>
              <Box
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 4,
                  border: '2px dashed var(--card-border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text size={1} muted>?</Text>
              </Box>
              <Text size={2} muted>Click to select an icon</Text>
            </Flex>
          )}
        </Flex>
      </Card>

      {dialogOpen && (
        <IconPickerDialog
          value={value}
          onSelect={handleSelect}
          onClear={handleClear}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </Stack>
  )
}

export default IconPickerInput
