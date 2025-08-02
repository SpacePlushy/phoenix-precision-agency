import { auth, currentUser } from '@clerk/nextjs/server'

/**
 * Get the current authenticated user's ID
 * @returns The user ID or null if not authenticated
 */
export async function getUserId() {
  const { userId } = await auth()
  return userId
}

/**
 * Get the full current user object
 * @returns The user object or null if not authenticated
 */
export async function getCurrentUser() {
  const user = await currentUser()
  return user
}

/**
 * Check if the current user is authenticated
 * @returns Boolean indicating authentication status
 */
export async function isAuthenticated() {
  const { userId } = await auth()
  return !!userId
}

/**
 * Protect a server action or API route
 * @throws Error if user is not authenticated
 */
export async function requireAuth() {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized: Authentication required')
  }
  
  return userId
}

/**
 * Get the organization ID if the user is part of an organization
 * @returns The organization ID or null
 */
export async function getOrganizationId() {
  const { orgId } = await auth()
  return orgId
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