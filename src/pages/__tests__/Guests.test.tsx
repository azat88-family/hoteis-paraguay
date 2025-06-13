// src/pages/__tests__/Guests.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Needed for Link components
import GuestsPage from '../Guests'; // Adjust path as needed
import * as guestService from '../../apiService/guestService'; // Mock the service

// Mock the guestService module
jest.mock('../../apiService/guestService');
const mockedGuestService = guestService as jest.Mocked<typeof guestService>;

// Mock useTranslation
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, options?: { count?: number } | string) => {
            if (options && typeof options === 'object' && options.count !== undefined) {
                return `${key}_plural_${options.count}`;
            }
            if (typeof options === 'string') { // For default value
                return options;
            }
            return key;
        }
    })
}));

// Mock AuthContext if needed by any child components or the page itself directly
jest.mock('../../contexts/AuthContext', () => ({
    useAuth: () => ({
      user: { role: 'admin' }, // Provide a default mock user or null as needed
      isAuthenticated: true,
      // Add any other properties/functions from AuthContextType that are used
    }),
}));


describe('GuestsPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockedGuestService.getGuests.mockReset();
  });

  it('should display loading state initially and then guests', async () => {
    const mockGuestsData: guestService.Guest[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '111', created_at: '2023-01-01T00:00:00.000Z' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '222', created_at: '2023-01-02T00:00:00.000Z' },
    ];
    mockedGuestService.getGuests.mockResolvedValueOnce(mockGuestsData);

    render(
      <MemoryRouter>
        <GuestsPage />
      </MemoryRouter>
    );

    // Check for loading indicator (adapt text/selector to your actual loading UI)
    // Using a more generic way to find loading text if specific key "guests.loading" is not used for a full-page spinner
    expect(screen.getByRole('status', { name: /loading/i }) || screen.getByText(/loading/i, { exact: false })).toBeInTheDocument();

    // Wait for the guests to be displayed
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    // Verify loading indicator is gone
    expect(screen.queryByRole('status', { name: /loading/i }) || screen.queryByText(/loading/i, { exact: false })).not.toBeInTheDocument();
  });

  it('should display error state if fetching guests fails', async () => {
    const errorMessage = 'Failed to fetch guests';
    mockedGuestService.getGuests.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <MemoryRouter>
        <GuestsPage />
      </MemoryRouter>
    );

    // Check for loading indicator first
    expect(screen.getByRole('status', { name: /loading/i }) || screen.getByText(/loading/i, { exact: false })).toBeInTheDocument();

    // Wait for error message to be displayed
    // The GuestsPage uses t('common.errorLoading', 'Error loading data') + error
    await waitFor(() => {
      expect(screen.getByText((content, element) => content.startsWith('common.errorLoading') && content.includes(errorMessage))).toBeInTheDocument();
    });

    // Verify loading indicator is gone
    expect(screen.queryByRole('status', { name: /loading/i }) || screen.queryByText(/loading/i, { exact: false })).not.toBeInTheDocument();
  });

  it('should display "No Guests Found" message if no guests are returned', async () => {
    mockedGuestService.getGuests.mockResolvedValueOnce([]); // Empty array of guests

    render(
      <MemoryRouter>
        <GuestsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('status', { name: /loading/i }) || screen.getByText(/loading/i, { exact: false })).toBeInTheDocument();

    await waitFor(() => {
      // The GuestsPage uses t('guests.noGuestsYet', 'There are no guests in the system yet. Try adding a new one!')
      // or t('guests.noGuestsMatchSearch', 'No guests match your current search query.')
      // For an empty list initially, it should be 'noGuestsYet'
      expect(screen.getByText('guests.noGuestsYet')).toBeInTheDocument();
    });
  });
});
