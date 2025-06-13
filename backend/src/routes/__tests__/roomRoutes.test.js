// backend/src/routes/__tests__/roomRoutes.test.js
const request = require('supertest');

// Mock the supabaseClient. This MUST be done before importing the app.
const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn(),
  // Add other methods like insert, update, delete if testing POST, PUT, DELETE routes
  auth: {
    getUser: jest.fn()
  }
};
jest.mock('../../config/supabaseClient', () => ({
  supabase: mockSupabaseClient
}));

// Import the app AFTER mocks are in place
const app = require('../../app');

describe('Room Routes /api/rooms', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/rooms', () => {
    it('should return 200 and rooms with active_guest information', async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(today.getDate() + 2);


      const mockRoomsFromSupabase = [
        {
          id: 1, room_number: '101', type: 'Standard', beds: 'Queen', capacity: 2, price_per_night: 120.00, status: 'occupied', features: ['Wi-Fi'], created_at: '2023-01-01T00:00:00Z',
          reservations: [
            {
              check_in_date: yesterday.toISOString().split('T')[0],
              check_out_date: tomorrow.toISOString().split('T')[0], // Active reservation
              guests: { id: 1, name: 'John Doe', email: 'john@example.com' }
            }
          ]
        },
        {
          id: 2, room_number: '102', type: 'Deluxe', beds: 'King', capacity: 2, price_per_night: 180.00, status: 'available', features: ['Wi-Fi', 'TV'], created_at: '2023-01-01T00:00:00Z',
          reservations: [] // No reservations
        },
        {
            id: 3, room_number: '103', type: 'Suite', beds: 'King', capacity: 3, price_per_night: 250.00, status: 'available', features: ['Wi-Fi', 'Minibar'], created_at: '2023-01-01T00:00:00Z',
            reservations: [
              {
                check_in_date: tomorrow.toISOString().split('T')[0],
                check_out_date: dayAfterTomorrow.toISOString().split('T')[0], // Future reservation
                guests: { id: 2, name: 'Jane Roe', email: 'jane@example.com' }
              }
            ]
        }
      ];

      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'user-id-rooms', user_metadata: { role: 'attendant' } } },
        error: null
      });
      mockSupabaseClient.select.mockResolvedValueOnce({ data: mockRoomsFromSupabase, error: null });

      const response = await request(app)
        .get('/api/rooms')
        .set('Authorization', 'Bearer fake-valid-token-rooms');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(3);

      // Room 101 should have John Doe as active guest
      const room101 = response.body.find(r => r.room_number === '101');
      expect(room101).toBeDefined();
      expect(room101.active_guest).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      });
      expect(room101.reservations).toBeUndefined(); // Ensure reservations array is removed

      // Room 102 should have no active guest
      const room102 = response.body.find(r => r.room_number === '102');
      expect(room102).toBeDefined();
      expect(room102.active_guest).toBeNull();
      expect(room102.reservations).toBeUndefined();

      // Room 103 should have no active guest (reservation is in the future)
      const room103 = response.body.find(r => r.room_number === '103');
      expect(room103).toBeDefined();
      expect(room103.active_guest).toBeNull();
      expect(room103.reservations).toBeUndefined();

      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledWith('fake-valid-token-rooms');
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('rooms');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith(expect.stringContaining('reservations')); // Check that reservations are being selected
    });

    it('should return 401 if not authorized', async () => {
        mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: { message: 'Unauthorized' } });
        const response = await request(app)
            .get('/api/rooms')
            .set('Authorization', 'Bearer invalid-token');
        expect(response.statusCode).toBe(401);
    });

    it('should handle Supabase errors when fetching rooms', async () => {
        mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
            data: { user: { id: 'user-id-rooms', user_metadata: { role: 'attendant' } } },
            error: null
        });
        mockSupabaseClient.select.mockResolvedValueOnce({ data: null, error: { message: 'Database error' } });

        const response = await request(app)
            .get('/api/rooms')
            .set('Authorization', 'Bearer fake-valid-token-rooms');

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Failed to fetch rooms and reservation data');
    });
  });
});
