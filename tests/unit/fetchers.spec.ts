import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchGlobal, fetchCollection } from '@/lib/fetchers'

// Mock the getPayload function
const mockPayload = {
  findGlobal: vi.fn(),
  find: vi.fn(),
}

vi.mock('payload', () => ({
  getPayload: vi.fn(() => Promise.resolve(mockPayload)),
}))

vi.mock('@payload-config', () => ({
  default: {},
}))

describe('Fetchers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchGlobal', () => {
    it('should fetch global with default parameters', async () => {
      const mockGlobalData = {
        id: 'global-1',
        title: 'Site Settings',
        description: 'Global site configuration',
      }

      mockPayload.findGlobal.mockResolvedValue(mockGlobalData)

      const result = await fetchGlobal('home-page', 'en')

      expect(mockPayload.findGlobal).toHaveBeenCalledWith({
        slug: 'home-page',
        overrideAccess: false,
        locale: 'en',
      })
      expect(result).toEqual(mockGlobalData)
    })

    it('should fetch global with custom depth option', async () => {
      const mockGlobalData = { id: 'global-2', title: 'About Page' }
      mockPayload.findGlobal.mockResolvedValue(mockGlobalData)

      await fetchGlobal('about-page', 'zh-Hans', { depth: 3 })

      expect(mockPayload.findGlobal).toHaveBeenCalledWith({
        slug: 'about-page',
        overrideAccess: false,
        locale: 'zh-Hans',
        depth: 3,
      })
    })

    it('should handle fetch global errors gracefully', async () => {
      const error = new Error('Global not found')
      mockPayload.findGlobal.mockRejectedValue(error)

      await expect(fetchGlobal('home-page' as any, 'en')).rejects.toThrow('Global not found')
    })
  })

  describe('fetchCollection', () => {
    it('should fetch collection with default parameters', async () => {
      const mockCollectionData = {
        docs: [
          { id: '1', title: 'Item 1' },
          { id: '2', title: 'Item 2' },
        ],
        totalDocs: 2,
        hasNextPage: false,
        hasPrevPage: false,
      }

      mockPayload.find.mockResolvedValue(mockCollectionData)

      const result = await fetchCollection('events', 'en')

      expect(mockPayload.find).toHaveBeenCalledWith({
        collection: 'events',
        locale: 'en',
        overrideAccess: false,
      })
      expect(result).toEqual(mockCollectionData.docs)
    })

    it('should fetch collection with all options', async () => {
      const mockCollectionData = {
        docs: [{ id: '3', title: 'Filtered Item' }],
      }
      mockPayload.find.mockResolvedValue(mockCollectionData)

      const options = {
        depth: 2,
        where: { status: { equals: 'published' } },
        limit: 5,
        sort: ['-createdAt', 'title'],
      }

      const result = await fetchCollection('events', 'zh-Hans', options)

      expect(mockPayload.find).toHaveBeenCalledWith({
        collection: 'events',
        locale: 'zh-Hans',
        overrideAccess: false,
        ...options,
      })
      expect(result).toEqual(mockCollectionData.docs)
    })

    it('should handle fetch collection errors gracefully', async () => {
      const error = new Error('Collection access denied')
      mockPayload.find.mockRejectedValue(error)

      await expect(fetchCollection('users', 'en')).rejects.toThrow('Collection access denied')
    })

    it('should work with different collection types', async () => {
      const mockMediaData = { docs: [{ id: 'media-1', filename: 'image.jpg' }] }
      mockPayload.find.mockResolvedValue(mockMediaData)

      await fetchCollection('media', 'en', { limit: 10 })

      expect(mockPayload.find).toHaveBeenCalledWith({
        collection: 'media',
        locale: 'en',
        overrideAccess: false,
        limit: 10,
      })
    })

    it('should handle string sort parameter', async () => {
      const mockData = { docs: [] as any[] }
      mockPayload.find.mockResolvedValue(mockData)

      await fetchCollection('events', 'en', { sort: 'title' })

      expect(mockPayload.find).toHaveBeenCalledWith({
        collection: 'events',
        locale: 'en',
        overrideAccess: false,
        sort: 'title',
      })
    })
  })

  describe('payload client caching', () => {
    it('should cache payload client instance', async () => {
      mockPayload.findGlobal.mockResolvedValue({ id: '1' })
      mockPayload.find.mockResolvedValue({ docs: [] })

      // Make multiple calls
      await fetchGlobal('home-page', 'en')
      await fetchCollection('events', 'en')
      await fetchGlobal('about-page', 'en')

      // Since the client is mocked, we can't test actual caching behavior
      // But we can verify multiple calls worked without errors
      expect(mockPayload.findGlobal).toHaveBeenCalledTimes(2)
      expect(mockPayload.find).toHaveBeenCalledTimes(1)
    })
  })
})
