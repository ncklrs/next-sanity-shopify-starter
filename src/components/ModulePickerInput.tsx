import { AddIcon, SearchIcon } from '@sanity/icons'
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Text,
  TextInput
} from '@sanity/ui'
import { randomKey } from '@sanity/util/content'
import { useCallback, useState } from 'react'
import type { ArrayOfObjectsInputProps, ObjectSchemaType } from 'sanity'

interface ModuleType {
  name: string
  title?: string
  description?: string
}

interface ModuleCardProps {
  module: ModuleType
  onClick: () => void
}

interface SelectModuleModalProps {
  modules: ModuleType[]
  onClose: () => void
  onItemAppend: (item: { _type: string; _key: string }) => void
}

interface AddModuleButtonProps extends Omit<ArrayOfObjectsInputProps, 'onItemAppend'> {
  schemaType: ArrayOfObjectsInputProps['schemaType'] & {
    of: ObjectSchemaType[]
  }
  onItemAppend: (item: { _type: string; _key: string }) => void
}

const ModuleCard = ({ module, onClick }: ModuleCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      padding={[3, 3, 4]}
      radius={2}
      shadow={isHovered ? 2 : 1}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      tone='default'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Flex gap={4} direction='column'>
        <Card
          radius={2}
          shadow={1}
          style={{
            position: 'relative',
            aspectRatio: '16 / 9',
            backgroundColor: '#1a1a2e',
            backgroundImage: `url(/modules/${module.name}.svg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <Flex gap={3} direction='column'>
          <Text size={2} weight='medium'>
            {module.title || module.name}
          </Text>
          <Text size={1} muted>
            {module.description || ''}
          </Text>
        </Flex>
      </Flex>
    </Card>
  )
}

const SelectModuleModal = ({
  modules,
  onClose,
  onItemAppend
}: SelectModuleModalProps) => {
  const [searchValue, setSearchValue] = useState('')

  const handleModuleClick = useCallback(
    (module: ModuleType) => {
      onItemAppend({
        _type: module.name,
        _key: randomKey(12)
      })
      onClose()
    },
    [onItemAppend, onClose]
  )

  const filteredModules = modules.filter(module => {
    const search = searchValue.toLowerCase()
    return (
      module.title?.toLowerCase().includes(search) ||
      module.name.toLowerCase().includes(search) ||
      module.description?.toLowerCase().includes(search)
    )
  })

  // Map module names to their categories
  const moduleToCategory: Record<string, string> = {
    // Hero
    heroDefault: 'hero', heroCentered: 'hero', heroSplit: 'hero', heroVideo: 'hero', heroMinimal: 'hero',
    // Features
    featuresGrid: 'features', featuresAlternating: 'features', featuresIconCards: 'features',
    // Pricing
    pricingCards: 'pricing', pricingComparison: 'pricing', pricingSimple: 'pricing',
    // Testimonials
    testimonialsGrid: 'testimonials', testimonialsCarousel: 'testimonials',
    testimonialsFeatured: 'testimonials', testimonialsCarouselLarge: 'testimonials',
    // Team
    teamGrid: 'team', teamCards: 'team', teamCompact: 'team',
    // CTA
    'cta.default': 'cta', 'cta.newsletter': 'cta', 'cta.split': 'cta', 'cta.banner': 'cta', 'cta.stats': 'cta',
    // Social Proof
    'socialProof.logos': 'socialProof', 'socialProof.stats': 'socialProof',
    // Logo Cloud
    logoCloudSimple: 'logoCloud', logoCloudMarquee: 'logoCloud', logoCloudGrid: 'logoCloud',
    // FAQ
    faqAccordion: 'faq', faqTwoColumn: 'faq', faqWithCategories: 'faq', faqSimple: 'faq',
    // Gallery
    galleryGrid: 'gallery', galleryMasonry: 'gallery', galleryCarousel: 'gallery',
    // Blog
    blogFeaturedPost: 'blog', blogGrid: 'blog', blogList: 'blog', blogCarousel: 'blog', blogMinimal: 'blog',
    // Form
    formContact: 'form', formNewsletter: 'form', formWithImage: 'form', formMultiStep: 'form',
    // Content (NEW)
    richTextBlock: 'content', quote: 'content', statsCounter: 'content', comparisonTable: 'content',
    // Media (NEW)
    videoEmbed: 'media', beforeAfter: 'media', codeBlock: 'media', embedBlock: 'media',
    // Interactive (NEW)
    tabs: 'interactive', accordion: 'interactive', steps: 'interactive', timeline: 'interactive',
    // Engagement (NEW)
    announcementBar: 'engagement', countdown: 'engagement', stickyCta: 'engagement', modal: 'engagement',
    // Trust (NEW)
    awards: 'trust', pressMentions: 'trust', caseStudyCards: 'trust', integrationGrid: 'trust',
    // Utility (NEW)
    spacer: 'utility', anchorPoint: 'utility', banner: 'utility', downloadCards: 'utility', multiColumn: 'utility',
  }

  // Get category for a module
  const getCategory = (name: string): string => {
    return moduleToCategory[name] || 'other'
  }

  // Group modules by category
  const groupedModules = filteredModules.reduce<Record<string, ModuleType[]>>((acc, module) => {
    const category = getCategory(module.name)
    if (!acc[category]) acc[category] = []
    acc[category].push(module)
    return acc
  }, {})

  const categoryOrder = [
    'hero',
    'features',
    'content',
    'media',
    'interactive',
    'pricing',
    'testimonials',
    'cta',
    'engagement',
    'socialProof',
    'trust',
    'team',
    'logoCloud',
    'faq',
    'gallery',
    'blog',
    'form',
    'utility'
  ]

  return (
    <Dialog
      header='Add Module'
      id='module-picker-dialog'
      onClose={onClose}
      zOffset={1000}
      width={2}
    >
      <Box
        padding={4}
        style={{ borderBottom: '1px solid var(--card-border-color)' }}
      >
        <TextInput
          fontSize={2}
          onChange={event => setSearchValue(event.currentTarget.value)}
          padding={[3, 3, 4]}
          radius={2}
          placeholder='Search modules...'
          value={searchValue}
          autoFocus
          icon={SearchIcon}
        />
      </Box>
      <Box padding={4} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {categoryOrder.map(category => {
          const categoryModules = groupedModules[category]
          if (!categoryModules || categoryModules.length === 0) return null

          const categoryTitles: Record<string, string> = {
            hero: 'Hero Sections',
            features: 'Features',
            content: 'Content & Text',
            media: 'Media & Embeds',
            interactive: 'Interactive',
            pricing: 'Pricing',
            testimonials: 'Testimonials',
            cta: 'Call to Action',
            engagement: 'Engagement',
            socialProof: 'Social Proof',
            trust: 'Trust & Credibility',
            team: 'Team',
            logoCloud: 'Logo Cloud',
            faq: 'FAQ',
            gallery: 'Gallery',
            blog: 'Blog',
            form: 'Forms',
            utility: 'Utility'
          }
          const categoryTitle = categoryTitles[category] || category.charAt(0).toUpperCase() + category.slice(1)

          return (
            <Box key={category} marginBottom={5}>
              <Text size={1} weight='semibold' muted style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {categoryTitle}
              </Text>
              <Grid columns={[1, 2, 3]} gap={4} marginTop={3}>
                {categoryModules.map(module => (
                  <ModuleCard
                    key={module.name}
                    module={module}
                    onClick={() => handleModuleClick(module)}
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

const AddModuleButton = (props: AddModuleButtonProps) => {
  const [open, setOpen] = useState(false)

  const onClose = useCallback(() => setOpen(false), [])
  const onOpen = useCallback(() => setOpen(true), [])

  const modules: ModuleType[] = props.schemaType.of.map((type: ObjectSchemaType) => ({
    name: type.name,
    title: type.title,
    description: (type as ObjectSchemaType & { description?: string }).description
  }))

  return (
    <Grid columns={1} gap={2}>
      <Button
        style={{ cursor: 'pointer' }}
        text='Add Module'
        icon={AddIcon}
        onClick={onOpen}
        mode='ghost'
        tone='primary'
      />

      {open && (
        <SelectModuleModal
          modules={modules}
          onClose={onClose}
          onItemAppend={props.onItemAppend}
        />
      )}
    </Grid>
  )
}

export function ModulePickerInput(props: ArrayOfObjectsInputProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return props.renderDefault({ ...props, arrayFunctions: AddModuleButton as any })
}

export default ModulePickerInput
