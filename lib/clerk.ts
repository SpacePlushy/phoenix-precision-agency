import { auth, currentUser } from '@clerk/nextjs/server'

/**
 * Check if Clerk is properly configured
 */
export function isClerkConfigured() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const secretKey = process.env.CLERK_SECRET_KEY
  
  return !!(publishableKey && 
         secretKey && 
         publishableKey !== 'your_clerk_publishable_key_here' &&
         secretKey !== 'your_clerk_secret_key_here' &&
         publishableKey.startsWith('pk_'))
}

/**
 * Get the current authenticated user's ID
 * @returns The user ID or null if not authenticated or Clerk not configured
 */
export async function getUserId() {
  if (!isClerkConfigured()) {
    return null
  }
  
  try {
    const { userId } = await auth()
    return userId
  } catch (_error) {
    // Silently return null if Clerk is not configured
    return null
  }
}

/**
 * Get the full current user object
 * @returns The user object or null if not authenticated or Clerk not configured
 */
export async function getCurrentUser() {
  if (!isClerkConfigured()) {
    return null
  }
  
  try {
    const user = await currentUser()
    return user || null
  } catch (_error) {
    // Silently return null if Clerk is not configured
    return null
  }
}

/**
 * Check if the current user is authenticated
 * @returns Boolean indicating authentication status
 */
export async function isAuthenticated() {
  if (!isClerkConfigured()) {
    return false
  }
  
  try {
    const { userId } = await auth()
    return !!userId
  } catch (error) {
    console.warn('Clerk not configured properly:', error)
    return false
  }
}

/**
 * Protect a server action or API route
 * @throws Error if user is not authenticated or Clerk not configured
 */
export async function requireAuth() {
  if (!isClerkConfigured()) {
    throw new Error('Authentication not configured. Please set up Clerk environment variables.')
  }
  
  try {
    const { userId } = await auth()
    
    if (!userId) {
      throw new Error('Unauthorized: Authentication required')
    }
    
    return userId
  } catch (error) {
    if (error instanceof Error && error.message.includes('Authentication not configured')) {
      throw error
    }
    throw new Error('Authentication service unavailable')
  }
}

/**
 * Get the organization ID if the user is part of an organization
 * @returns The organization ID or null
 */
export async function getOrganizationId() {
  if (!isClerkConfigured()) {
    return null
  }
  
  try {
    const { orgId } = await auth()
    return orgId
  } catch (_error) {
    // Silently return null if Clerk is not configured
    return null
  }
}

/**
 * Configuration for Clerk
 */
export const clerkConfig = {
  signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in',
  signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/sign-up',
  afterSignInUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/dashboard',
  afterSignUpUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/dashboard',
}