import { TextStateFeature } from '@payloadcms/richtext-lexical'

const TextColorFeature = TextStateFeature({
  state: {
    color: {
      black: {
        label: 'Black',
        css: { color: '#000000' },
      },
      white: {
        label: 'White',
        css: { color: '#ffffff' },
      },
      red: {
        label: 'Red',
        css: { color: '#ff0000' },
      },
      blue: {
        label: 'Blue',
        css: { color: '#0000ff' },
      },
      green: {
        label: 'Green',
        css: { color: '#00aa00' },
      },
      orange: {
        label: 'Orange',
        css: { color: '#ff8800' },
      },
      purple: {
        label: 'Purple',
        css: { color: '#8800ff' },
      },
      pink: {
        label: 'Pink',
        css: { color: '#ff0088' },
      },
      cyan: {
        label: 'Cyan',
        css: { color: '#00ffff' },
      },
      yellow: {
        label: 'Yellow',
        css: { color: '#ffff00' },
      },
      gray: {
        label: 'Gray',
        css: { color: '#808080' },
      },
      'theme-green': {
        label: 'Theme Dark Green',
        css: { color: 'rgb(21, 78, 48)' },
      },
      'theme-gold': {
        label: 'Theme Gold',
        css: { color: 'rgb(233, 170, 28)' },
      },
    },
    backgroundColor: {
      'highlight-yellow': {
        label: 'Yellow Highlight',
        css: { 'background-color': '#ffff00', padding: '2px 4px', 'border-radius': '4px' },
      },
      'highlight-blue': {
        label: 'Blue Highlight',
        css: { 'background-color': '#e6f3ff', padding: '2px 4px', 'border-radius': '4px' },
      },
      'highlight-green': {
        label: 'Green Highlight',
        css: { 'background-color': '#e6ffe6', padding: '2px 4px', 'border-radius': '4px' },
      },
    },
  },
})

export default TextColorFeature
