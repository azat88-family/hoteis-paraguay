// backend/src/routes/__tests__/guestRoutes.test.js
const request = require('supertest');
// Note: We don't need to import express directly here unless we are creating a new app instance for each test suite.
// Instead, we will import the existing app from '../../app.js' AFTER mocks are set up.

// Mock the supabaseClient. This MUST be done before importing the app or any modules that use supabaseClient.
const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(), // Added for completeness, though not used in these specific tests
  delete: jest.fn(), // Added for completeness
  auth: {
    getUser: jest.fn()
  }
};
jest.mock('../../config/supabaseClient', () => ({
  supabase: mockSupabaseClient
}));

// Import the app AFTER mocks are in place
const app = require('../../app');

describe('Guest Routes /api/guests', () => {
  beforeEach(() => {
    // Clears all mock usage data (e.g., number of calls) before each test
    jest.clearAllMocks();
  });

  describe('GET /api/guests', () => {
    it('should return 200 and a list of guests if authorized', async () => {
      const mockGuests = [{ id: 1, name: 'John Doe', email: 'john@example.com' }];
      // Mock successful token verification and user retrieval for 'protect' middleware
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'user-id-123', user_metadata: { role: 'attendant' } } },
        error: null
      });
      // Mock Supabase query result
      mockSupabaseClient.select.mockResolvedValueOnce({ data: mockGuests, error: null });

      const response = await request(app)
        .get('/api/guests')
        .set('Authorization', 'Bearer fake-valid-token');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockGuests);
      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledWith('fake-valid-token');
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('guests');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
    });

    it('should return 401 if token is missing', async () => {
        const response = await request(app).get('/api/guests'); // No Authorization header
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Not authorized, no token provided');
    });

    it('should return 401 if token is invalid or Supabase auth fails', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid token' }
      });

      const response = await request(app)
        .get('/api/guests')
        .set('Authorization', 'Bearer fake-invalid-token');

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toContain('Not authorized, token failed');
    });
  });

  describe('POST /api/guests', () => {
    const newGuestPayload = { name: 'Jane Doe', email: 'jane@example.com', phone: '1234567890' };
    const createdGuestResponse = { id: 2, ...newGuestPayload, created_at: new Date().toISOString() };

    it('should return 201 and create a new guest if authorized with "admin" role', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'admin-user-id', user_metadata: { role: 'admin' } } },
        error: null
      });
      mockSupabaseClient.insert.mockResolvedValueOnce({ data: [createdGuestResponse], error: null });
      // The .select() chained after .insert() in the route handler also needs to be mocked if its result is used.
      // Assuming it's just to return the inserted data, the mock above for insert should be enough if it returns data.
      // If .select() is explicitly called and its return value shaped the response, then:
      mockSupabaseClient.select.mockResolvedValueOnce({ data: [createdGuestResponse], error: null });


      const response = await request(app)
        .post('/api/guests')
        .set('Authorization', 'Bearer fake-admin-token')
        .send(newGuestPayload);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual([createdGuestResponse]); // Route returns data in an array
      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledWith('fake-admin-token');
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('guests');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith([newGuestPayload]);
    });

    it('should return 201 and create a new guest if authorized with "attendant" role', async () => {
        mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
          data: { user: { id: 'attendant-user-id', user_metadata: { role: 'attendant' } } },
          error: null
        });
        mockSupabaseClient.insert.mockResolvedValueOnce({ data: [createdGuestResponse], error: null });
        mockSupabaseClient.select.mockResolvedValueOnce({ data: [createdGuestResponse], error: null });

        const response = await request(app)
          .post('/api/guests')
          .set('Authorization', 'Bearer fake-attendant-token')
          .send(newGuestPayload);

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual([createdGuestResponse]);
    });

    it('should return 403 if user role is not "admin" or "attendant"', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'guest-user-id', user_metadata: { role: 'guest' } } }, // 'guest' role
        error: null
      });

      const response = await request(app)
        .post('/api/guests')
        .set('Authorization', 'Bearer fake-guest-token')
        .send(newGuestPayload);

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toContain('not authorized');
    });

    it('should return 401 if not authorized (no token for POST)', async () => {
        const response = await request(app)
            .post('/api/guests')
            .send(newGuestPayload); // No Authorization header
        expect(response.statusCode).toBe(401);
    });

    it('should return 400 if required fields (name, email) are missing', async () => {
        mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
            data: { user: { id: 'admin-user-id', user_metadata: { role: 'admin' } } },
            error: null
        });
        const response = await request(app)
            .post('/api/guests')
            .set('Authorization', 'Bearer fake-admin-token')
            .send({ phone: '123' }); // Missing name and email
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Name and email are required'); // Standardized to 'message'
    });
  });
});
