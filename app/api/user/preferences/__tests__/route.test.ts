import { NextRequest, NextResponse } from 'next/server';
import { GET, PATCH } from '../route';
import { redis } from '@/lib/upstash';
import { currentUser } from '@clerk/nextjs/server';

// Mock dependencies
jest.mock('@/lib/upstash', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

jest.mock('@clerk/nextjs/server', () => ({
  currentUser: jest.fn(),
}));

describe('/api/user/preferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/user/preferences', () => {
    it('returns default preferences for non-authenticated users', async () => {
      (currentUser as jest.Mock).mockRejectedValueOnce(new Error('Not authenticated'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ theme: 'system' });
    });

    it('returns stored preferences for authenticated users', async () => {
      const mockUser = { id: 'user_123' };
      const mockPreferences = {
        theme: 'dark',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      (currentUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (redis?.get as jest.Mock).mockResolvedValueOnce(mockPreferences);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPreferences);
      expect(redis?.get).toHaveBeenCalledWith('user:user_123:preferences');
    });

    it('returns default preferences when no stored preferences exist', async () => {
      const mockUser = { id: 'user_123' };

      (currentUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (redis?.get as jest.Mock).mockResolvedValueOnce(null);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ theme: 'system' });
    });

    it('handles Redis errors gracefully', async () => {
      const mockUser = { id: 'user_123' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      (currentUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (redis?.get as jest.Mock).mockRejectedValueOnce(new Error('Redis error'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to fetch preferences' });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching user preferences:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('handles currentUser errors as non-authenticated', async () => {
      (currentUser as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Clerk error');
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ theme: 'system' });
    });
  });

  describe('PATCH /api/user/preferences', () => {
    it('returns success for non-authenticated users without persisting', async () => {
      (currentUser as jest.Mock).mockRejectedValueOnce(new Error('Not authenticated'));

      const request = new NextRequest('http://localhost/api/user/preferences', {
        method: 'PATCH',
        body: JSON.stringify({ theme: 'dark' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
      expect(redis?.set).not.toHaveBeenCalled();
    });

    it('updates preferences for authenticated users', async () => {
      const mockUser = { id: 'user_123' };
      const mockDate = '2024-01-01T00:00:00.000Z';
      jest.spyOn(global, 'Date').mockImplementation(() => ({
        toISOString: () => mockDate,
      } as any));

      (currentUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (redis?.set as jest.Mock).mockResolvedValueOnce('OK');

      const request = new NextRequest('http://localhost/api/user/preferences', {
        method: 'PATCH',
        body: JSON.stringify({ theme: 'dark' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        preferences: {
          theme: 'dark',
          updatedAt: mockDate,
        },
      });
      expect(redis?.set).toHaveBeenCalledWith('user:user_123:preferences', {
        theme: 'dark',
        updatedAt: mockDate,
      });
    });

    it('validates theme value - rejects invalid themes', async () => {
      const mockUser = { id: 'user_123' };
      (currentUser as jest.Mock).mockResolvedValueOnce(mockUser);

      const request = new NextRequest('http://localhost/api/user/preferences', {
        method: 'PATCH',
        body: JSON.stringify({ theme: 'invalid-theme' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid theme value' });
      expect(redis?.set).not.toHaveBeenCalled();
    });

    it('validates theme value - rejects missing theme', async () => {
      const mockUser = { id: 'user_123' };
      (currentUser as jest.Mock).mockResolvedValueOnce(mockUser);

      const request = new NextRequest('http://localhost/api/user/preferences', {
        method: 'PATCH',
        body: JSON.stringify({}),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid theme value' });
    });

    it('accepts all valid theme values', async () => {
      const mockUser = { id: 'user_123' };
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      (redis?.set as jest.Mock).mockResolvedValue('OK');

      const themes = ['light', 'dark', 'system'];

      for (const theme of themes) {
        const request = new NextRequest('http://localhost/api/user/preferences', {
          method: 'PATCH',
          body: JSON.stringify({ theme }),
        });

        const response = await PATCH(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.preferences.theme).toBe(theme);
      }
    });

    it('handles Redis errors gracefully', async () => {
      const mockUser = { id: 'user_123' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      (currentUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (redis?.set as jest.Mock).mockRejectedValueOnce(new Error('Redis error'));

      const request = new NextRequest('http://localhost/api/user/preferences', {
        method: 'PATCH',
        body: JSON.stringify({ theme: 'dark' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to update preferences' });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error updating user preferences:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('handles invalid JSON body', async () => {
      const mockUser = { id: 'user_123' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      (currentUser as jest.Mock).mockResolvedValueOnce(mockUser);

      const request = new NextRequest('http://localhost/api/user/preferences', {
        method: 'PATCH',
        body: 'invalid-json',
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to update preferences' });

      consoleErrorSpy.mockRestore();
    });
  });
});