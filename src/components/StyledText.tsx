import { RichText } from '@payloadcms/richtext-lexical/react'

type RichTextData = Parameters<typeof RichText>[0]['data']

interface StyledTextProps {
  data?: RichTextData | null
  className?: string
}

export function StyledText({ data, className }: StyledTextProps) {
  if (!data) return null

  return (
    <div className={className}>
      <RichText data={data} />
    </div>
  )
}
