import type { StyledText } from '@/lib/types'

interface StyledTextComponentProps {
  data: StyledText[] | null | undefined
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div'
  gap?: number
}

function getClasses(line: StyledText): string {
  const sizeClasses = {
    Small: 'text-sm md:text-base',
    Normal: 'text-base',
    Large: 'text-2xl md:text-3xl',
    'Extra-Large': 'text-4xl md:text-5xl font-bold',
  }
  const colorClasses = {
    Default: '',
    'Website-Theme-Color1': 'text-[rgb(var(--website-theme-color1))]',
    'Website-Theme-Color2': 'text-[rgb(var(--website-theme-color2))]',
  }
  const styleClasses = {
    Normal: 'not-italic',
    Italic: 'italic',
    Bold: 'font-bold',
    Underline: 'underline',
  }

  return [
    'transition-colors',
    sizeClasses[line.font_size || 'Normal'],
    colorClasses[line.color || 'Default'],
    styleClasses[line.font_style || 'Normal'],
  ]
    .filter(Boolean)
    .join(' ')
}

// Predefined margin-top classes to ensure Tailwind can purge unused styles
const MARGIN_TOP_CLASSES: Record<number, string> = {
  2: 'mt-2',
  4: 'mt-4',
  6: 'mt-6',
  8: 'mt-8',
  12: 'mt-12',
  16: 'mt-16',
}

export function StyledText({ data, as: Tag = 'p', gap = 4 }: StyledTextComponentProps) {
  if (!data || data.length === 0) return null

  const marginClass = MARGIN_TOP_CLASSES[gap] || 'mt-4'

  return (
    <div>
      {data.map((line, i) => (
        <Tag key={i} className={`${getClasses(line)}${i > 0 ? ` ${marginClass}` : ''}`}>
          {line.text}
        </Tag>
      ))}
    </div>
  )
}
