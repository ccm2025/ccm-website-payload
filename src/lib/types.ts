// Core types
export interface MediaAsset {
  url: string
  alt?: string
}

export type StrapiMedia = MediaAsset

export interface StyledText {
  text: string
  font_size?: 'Small' | 'Normal' | 'Large' | 'Extra-Large'
  color?: 'Default' | 'Website-Theme-Color1' | 'Website-Theme-Color2'
  font_style?: 'Normal' | 'Italic' | 'Bold' | 'Underline'
}

export interface InfoSection {
  id: number
  subtitle?: string
  title: string
  content: StyledText[]
  image: MediaAsset
  button_text?: string
  button_url?: string
}

// Status and timestamp support
export type DocumentStatus = 'draft' | 'published'

export interface TimestampedDoc {
  id: number
  createdAt?: string
  updatedAt?: string
  _status?: DocumentStatus
}

// Languages
export const ALLOWED_LANGS = ['en', 'zh-Hans'] as const
export type AllowedLang = (typeof ALLOWED_LANGS)[number]
