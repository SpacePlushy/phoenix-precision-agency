import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { redis } from '@/lib/upstash';

export async function GET() {
  try {
    // Get authenticated user (optional - works without auth too)
    const user = await currentUser().catch(() => null);
    
    if (!user) {
      // Return default preferences for non-authenticated users
      return NextResponse.json({
        theme: 'system'
      });
    }

    // Get user preferences from Redis
    const preferences = await redis?.get(`user:${user.id}:preferences`);
    
    if (!preferences) {
      // Return default preferences if none exist
      return NextResponse.json({
        theme: 'system'
      });
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Get authenticated user (optional)
    const user = await currentUser().catch(() => null);
    
    if (!user) {
      // For non-authenticated users, just return success
      // The theme will be stored in localStorage on the client
      return NextResponse.json({ success: true });
    }

    const body = await request.json();
    const { theme } = body;

    // Validate theme value
    if (!theme || !['light', 'dark', 'system'].includes(theme)) {
      return NextResponse.json(
        { error: 'Invalid theme value' },
        { status: 400 }
      );
    }

    // Update user preferences in Redis
    const preferences = {
      theme,
      updatedAt: new Date().toISOString()
    };

    await redis?.set(`user:${user.id}:preferences`, preferences);

    return NextResponse.json({ success: true, preferences });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}