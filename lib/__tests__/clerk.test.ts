import { isClerkConfigured, getUserId, getCurrentUser, isAuthenticated, requireAuth, getOrganizationId } from '../clerk'

// Mock Clerk functions
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
  currentUser: jest.fn(),
}))

const originalEnv = process.env

describe('Clerk Utilities', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('isClerkConfigured', () => {
    it('should return false when environment variables are not set', () => {
      delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      delete process.env.CLERK_SECRET_KEY

      const result = isClerkConfigured()
      
      expect(result).toBe(false)
    })

    it('should return false when environment variables have placeholder values', () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'your_clerk_publishable_key_here'
      process.env.CLERK_SECRET_KEY = 'your_clerk_secret_key_here'

      const result = isClerkConfigured()
      
      expect(result).toBe(false)
    })

    it('should return false when publishable key has wrong format', () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'invalid_format'
      process.env.CLERK_SECRET_KEY = 'sk_test_validkey'

      const result = isClerkConfigured()
      
      expect(result).toBe(false)
    })

    it('should return true when environment variables are properly configured', () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_validkey123'
      process.env.CLERK_SECRET_KEY = 'sk_test_validkey456'

      const result = isClerkConfigured()
      
      expect(result).toBe(true)
    })
  })

  describe('getUserId', () => {
    it('should return null when Clerk is not configured', async () => {
      delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      delete process.env.CLERK_SECRET_KEY

      const result = await getUserId()
      
      expect(result).toBeNull()
    })

    it('should return null when auth throws an error', async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_validkey123'
      process.env.CLERK_SECRET_KEY = 'sk_test_validkey456'
      
      const { auth } = require('@clerk/nextjs/server')
      auth.mockRejectedValue(new Error('Auth failed'))

      const result = await getUserId()
      
      expect(result).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should return false when Clerk is not configured', async () => {
      delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      delete process.env.CLERK_SECRET_KEY

      const result = await isAuthenticated()
      
      expect(result).toBe(false)
    })

    it('should return false when auth throws an error', async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_validkey123'
      process.env.CLERK_SECRET_KEY = 'sk_test_validkey456'
      
      const { auth } = require('@clerk/nextjs/server')
      auth.mockRejectedValue(new Error('Auth failed'))

      const result = await isAuthenticated()
      
      expect(result).toBe(false)
    })
  })

  describe('requireAuth', () => {
    it('should throw authentication not configured error when Clerk is not configured', async () => {
      delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      delete process.env.CLERK_SECRET_KEY

      await expect(requireAuth()).rejects.toThrow('Authentication not configured. Please set up Clerk environment variables.')
    })

    it('should throw authentication service unavailable when auth fails', async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_validkey123'
      process.env.CLERK_SECRET_KEY = 'sk_test_validkey456'
      
      const { auth } = require('@clerk/nextjs/server')
      auth.mockRejectedValue(new Error('Auth failed'))

      await expect(requireAuth()).rejects.toThrow('Authentication service unavailable')
    })
  })

  describe('getCurrentUser', () => {
    it('should return null when Clerk is not configured', async () => {
      delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      delete process.env.CLERK_SECRET_KEY

      const result = await getCurrentUser()
      
      expect(result).toBeNull()
    })

    it('should return null when currentUser throws an error', async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_validkey123'
      process.env.CLERK_SECRET_KEY = 'sk_test_validkey456'
      
      const { currentUser } = require('@clerk/nextjs/server')
      currentUser.mockImplementation(() => {
        throw new Error('CurrentUser failed')
      })

      const result = await getCurrentUser()
      
      expect(result).toBe(null)
    })
  })

  describe('getOrganizationId', () => {
    it('should return null when Clerk is not configured', async () => {
      delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      delete process.env.CLERK_SECRET_KEY

      const result = await getOrganizationId()
      
      expect(result).toBeNull()
    })

    it('should return null when auth throws an error', async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_validkey123'
      process.env.CLERK_SECRET_KEY = 'sk_test_validkey456'
      
      const { auth } = require('@clerk/nextjs/server')
      auth.mockRejectedValue(new Error('Auth failed'))

      const result = await getOrganizationId()
      
      expect(result).toBeNull()
    })
  })
})