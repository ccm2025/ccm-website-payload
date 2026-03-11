import { defaultJSXConverters, RichText } from '@payloadcms/richtext-lexical/react'
import './StyledText.css'
import { SerializedTextNode } from '@payloadcms/richtext-lexical'
import { Subscript } from 'lucide-react'

type RichTextData = Parameters<typeof RichText>[0]['data']

interface StyledTextProps {
  data?: RichTextData | null
}

const colorMap: Record<string, string> = {
  black: '#000000',
  white: '#ffffff',
  red: '#ff0000',
  blue: '#0000ff',
  green: '#00aa00',
  orange: '#ff8800',
  purple: '#8800ff',
  pink: '#ff0088',
  cyan: '#00ffff',
  yellow: '#ffff00',
  gray: '#808080',
  'theme-green': 'rgb(21, 78, 48)',
  'theme-gold': 'rgb(233, 170, 28)',
}

const bgColorMap: Record<string, any> = {
  'highlight-yellow': { backgroundColor: '#ffff00', padding: '2px 4px', borderRadius: '4px' },
  'highlight-blue': { backgroundColor: '#e6f3ff', padding: '2px 4px', borderRadius: '4px' },
  'highlight-green': { backgroundColor: '#e6ffe6', padding: '2px 4px', borderRadius: '4px' },
}

const jsxConverter = () => ({
  ...defaultJSXConverters,
  text: ({ node }: { node: SerializedTextNode }) => {
    const text = node.text || ''
    const styles: any = {}

    if (node.$ && node.$.color && colorMap[node.$.color as keyof typeof colorMap]) {
      styles.color = colorMap[node.$.color as keyof typeof colorMap]
    }

    if (
      node.$ &&
      node.$.backgroundColor &&
      bgColorMap[node.$.backgroundColor as keyof typeof bgColorMap]
    ) {
      Object.assign(styles, bgColorMap[node.$.backgroundColor as keyof typeof bgColorMap])
    }

    let formattedText = text
    let element = <span>{formattedText}</span>

    if (node.format & 1) {
      element = <strong>{element}</strong>
    }
    if (node.format & 2) {
      element = <em>{element}</em>
    }
    if (node.format & 4) {
      element = <del>{element}</del>
    }
    if (node.format & 8) {
      element = <u>{element}</u>
    }
    if (node.format & 16) {
      element = <code>{element}</code>
    }
    if (node.format & 32) {
      element = <sub>{element}</sub>
    }
    if (node.format & 64) {
      element = <sup>{element}</sup>
    }

    if (Object.keys(styles).length > 0) {
      element = <span style={styles}>{element}</span>
    }

    return element
  },
})

export function StyledText({ data }: StyledTextProps) {
  if (!data) return null

  return (
    <div>
      <RichText className="styled-text" data={data} converters={jsxConverter} />
    </div>
  )
}
