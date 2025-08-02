/**
 * Environment configuration utilities
 * Centralized place to check if various services are configured
 */

export interface ServiceConfig {
  isConfigured: boolean
  service: string
  missingKeys?: string[]
}

/**
 * Check if Clerk authentication is properly configured
 */
export function checkClerkConfig(): ServiceConfig {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const secretKey = process.env.CLERK_SECRET_KEY
  
  const missingKeys = []
  
  if (!publishableKey || publishableKey === 'your_clerk_publishable_key_here') {
    missingKeys.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')
  }
  
  if (!secretKey || secretKey === 'your_clerk_secret_key_here') {
    missingKeys.push('CLERK_SECRET_KEY')
  }
  
  if (publishableKey && !publishableKey.startsWith('pk_')) {
    missingKeys.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (invalid format)')
  }
  
  return {
    isConfigured: missingKeys.length === 0,
    service: 'Clerk Authentication',
    missingKeys: missingKeys.length > 0 ? missingKeys : undefined
  }
}

/**
 * Check if Upstash Redis is properly configured
 */
export function checkRedisConfig(): ServiceConfig {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  
  const missingKeys = []
  
  if (!url || url.includes('your-redis-instance') || !url.startsWith('https://')) {
    missingKeys.push('UPSTASH_REDIS_REST_URL')
  }
  
  if (!token || token === 'your_upstash_redis_rest_token_here') {
    missingKeys.push('UPSTASH_REDIS_REST_TOKEN')
  }
  
  return {
    isConfigured: missingKeys.length === 0,
    service: 'Upstash Redis',
    missingKeys: missingKeys.length > 0 ? missingKeys : undefined
  }
}

/**
 * Check if Resend email service is properly configured
 */
export function checkResendConfig(): ServiceConfig {
  const apiKey = process.env.RESEND_API_KEY
  
  const missingKeys = []
  
  if (!apiKey || apiKey === 're_your_resend_api_key_here' || !apiKey.startsWith('re_')) {
    missingKeys.push('RESEND_API_KEY')
  }
  
  return {
    isConfigured: missingKeys.length === 0,
    service: 'Resend Email',
    missingKeys: missingKeys.length > 0 ? missingKeys : undefined
  }
}

/**
 * Get configuration status for all services
 */
export function getAllServiceConfigs(): ServiceConfig[] {
  return [
    checkClerkConfig(),
    checkRedisConfig(),
    checkResendConfig()
  ]
}

/**
 * Check if any critical services are missing (for dashboard access)
 */
export function hasCriticalServicesMissing(): boolean {
  const clerkConfig = checkClerkConfig()
  return !clerkConfig.isConfigured
}

/**
 * Get a user-friendly configuration status message
 */
export function getConfigurationMessage(): string {
  const configs = getAllServiceConfigs()
  const missingServices = configs.filter(config => !config.isConfigured)
  
  if (missingServices.length === 0) {
    return 'All services are properly configured!'
  }
  
  const serviceNames = missingServices.map(config => config.service).join(', ')
  return `The following services need configuration: ${serviceNames}`
}