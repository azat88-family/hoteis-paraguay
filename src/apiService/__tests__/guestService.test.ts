// src/apiService/__tests__/guestService.test.ts
import { getGuests, createGuest, Guest } from '../guestService'; // Adjust path as needed

// Mock global fetch
global.fetch = jest.fn();

const API_URL = process.env.REACT_APP_API_URL || '/api';


describe('guestService', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    (fetch as jest.Mock).mockClear();
  });

  describe('getGuests', () => {
    it('should fetch guests successfully', async () => {
      const mockData: Guest[] = [{ id: 1, name: 'Guest 1', email: 'g1@example.com', created_at: '2023-01-01T00:00:00Z' }];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });
      const result = await getGuests();
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/guests`);
      expect(result).toEqual(mockData);
    });

    it('should throw an error if fetch fails for getGuests', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Failed to fetch guests' }) // Mock error response
      });
      await expect(getGuests()).rejects.toThrow('Failed to fetch guests');
    });

    it('should throw a default error message if fetch fails and response cannot be parsed for getGuests', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          json: async () => { throw new Error('Parsing error'); } // Simulate error during response.json()
        });
        await expect(getGuests()).rejects.toThrow('Failed to fetch guests');
      });
  });

  describe('createGuest', () => {
    it('should create a guest successfully', async () => {
      const guestData: Omit<Guest, 'id' | 'created_at'> = { name: 'New Guest', email: 'new@example.com', phone: '123' };
      const mockResponse: Guest = { id: 2, ...guestData, created_at: '2023-01-01T00:00:00Z' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
      const result = await createGuest(guestData);
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestData),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if fetch fails for createGuest', async () => {
      const guestData: Omit<Guest, 'id' | 'created_at'> = { name: 'New Guest', email: 'new@example.com' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Failed to create guest' })
      });
      await expect(createGuest(guestData)).rejects.toThrow('Failed to create guest');
    });

    it('should throw a default error message if fetch fails and response cannot be parsed for createGuest', async () => {
        const guestData: Omit<Guest, 'id' | 'created_at'> = { name: 'New Guest', email: 'new@example.com' };
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          json: async () => { throw new Error('Parsing error'); }
        });
        await expect(createGuest(guestData)).rejects.toThrow('Failed to create guest');
      });
  });
});
