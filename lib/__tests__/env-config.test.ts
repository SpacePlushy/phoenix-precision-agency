import { checkClerkConfig, checkRedisConfig, checkResendConfig, getAllServiceConfigs, hasCriticalServicesMissing } from '../env-config'

// Mock environment variables
const originalEnv = process.env

describe('Environment Configuration', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('checkClerkConfig', () => {
    it('should return not configured when keys are missing', () => {
      delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      delete process.env.CLERK_SECRET_KEY

      const result = checkClerkConfig()
      
      expect(result.isConfigured).toBe(false)
      expect(result.service).toBe('Clerk Authentication')
      expect(result.missingKeys).toContain('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')
      expect(result.missingKeys).toContain('CLERK_SECRET_KEY')
    })

    it('should return not configured when keys are placeholder values', () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'your_clerk_publishable_key_here'
      process.env.CLERK_SECRET_KEY = 'your_clerk_secret_key_here'

      const result = checkClerkConfig()
      
      expect(result.isConfigured).toBe(false)
      expect(result.service).toBe('Clerk Authentication')
      expect(result.missingKeys).toContain('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')
      expect(result.missingKeys).toContain('CLERK_SECRET_KEY')
    })

    it('should return not configured when publishable key has wrong format', () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'invalid_key_format'
      process.env.CLERK_SECRET_KEY = 'sk_test_validkey'

      const result = checkClerkConfig()
      
      expect(result.isConfigured).toBe(false)
      expect(result.service).toBe('Clerk Authentication')
      expect(result.missingKeys).toContain('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (invalid format)')
    })

    it('should return configured when keys are valid', () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_validkey123'
      process.env.CLERK_SECRET_KEY = 'sk_test_validkey456'

      const result = checkClerkConfig()
      
      expect(result.isConfigured).toBe(true)
      expect(result.service).toBe('Clerk Authentication')
      expect(result.missingKeys).toBeUndefined()
    })
  })

  describe('checkRedisConfig', () => {
    it('should return not configured when Redis keys are missing', () => {
      delete process.env.UPSTASH_REDIS_REST_URL
      delete process.env.UPSTASH_REDIS_REST_TOKEN

      const result = checkRedisConfig()
      
      expect(result.isConfigured).toBe(false)
      expect(result.service).toBe('Upstash Redis')
      expect(result.missingKeys).toContain('UPSTASH_REDIS_REST_URL')
      expect(result.missingKeys).toContain('UPSTASH_REDIS_REST_TOKEN')
    })

    it('should return configured when Redis keys are valid', () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://valid-redis-instance.upstash.io'
      process.env.UPSTASH_REDIS_REST_TOKEN = 'valid_redis_token'

      const result = checkRedisConfig()
      
      expect(result.isConfigured).toBe(true)
      expect(result.service).toBe('Upstash Redis')
      expect(result.missingKeys).toBeUndefined()
    })
  })

  describe('checkResendConfig', () => {
    it('should return not configured when Resend key is missing', () => {
      delete process.env.RESEND_API_KEY

      const result = checkResendConfig()
      
      expect(result.isConfigured).toBe(false)
      expect(result.service).toBe('Resend Email')
      expect(result.missingKeys).toContain('RESEND_API_KEY')
    })

    it('should return configured when Resend key is valid', () => {
      process.env.RESEND_API_KEY = 're_valid_resend_key'

      const result = checkResendConfig()
      
      expect(result.isConfigured).toBe(true)
      expect(result.service).toBe('Resend Email')
      expect(result.missingKeys).toBeUndefined()
    })
  })

  describe('hasCriticalServicesMissing', () => {
    it('should return true when Clerk is not configured', () => {
      delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      delete process.env.CLERK_SECRET_KEY

      const result = hasCriticalServicesMissing()
      
      expect(result).toBe(true)
    })

    it('should return false when Clerk is configured', () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_validkey123'
      process.env.CLERK_SECRET_KEY = 'sk_test_validkey456'

      const result = hasCriticalServicesMissing()
      
      expect(result).toBe(false)
    })
  })

  describe('getAllServiceConfigs', () => {
    it('should return all service configurations', () => {
      const result = getAllServiceConfigs()
      
      expect(result).toHaveLength(3)
      expect(result.map(config => config.service)).toEqual([
        'Clerk Authentication',
        'Upstash Redis',
        'Resend Email'
      ])
    })
  })
})