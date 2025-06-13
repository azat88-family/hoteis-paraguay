// src/components/layout/__tests__/Sidebar.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // For NavLink components
import Sidebar from '../Sidebar'; // Adjust path as needed
import { AuthContext, AuthContextType } from '../../../contexts/AuthContext'; // Adjust path
import { User } from '../../../contexts/AuthContext'; // Assuming User type is also exported or define here

// Mock useTranslation
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, defaultValue?: string) => defaultValue || key
    })
}));

// Mock CurrencyRates component as it's not relevant to this test
jest.mock('../CurrencyRates', () => () => <div data-testid="currency-rates-mock">CurrencyRates</div>);


const renderWithAuth = (user: User | null, ui: React.ReactElement) => {
  // Simplified AuthContext mock based on actual AuthContext structure
  const mockAuthContextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: false, // Assuming not loading for these tests
    login: jest.fn().mockResolvedValue(true),
    logout: jest.fn(),
    // Add any other properties used by Sidebar from the actual AuthContextType
  };
  return render(
    <AuthContext.Provider value={mockAuthContextValue}>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Sidebar', () => {
  it('shows links for "admin" role', () => {
    renderWithAuth({ id: '1', role: 'admin', email: 'admin@example.com', name: 'Admin User' }, <Sidebar />);

    expect(screen.getByText('dashboard.title')).toBeInTheDocument(); // Painel (links to /admin-dashboard)
    expect(screen.getByText('guests.title')).toBeInTheDocument();
    expect(screen.getByText('rooms.title')).toBeInTheDocument();
    expect(screen.getByText('reservations.title')).toBeInTheDocument();
    expect(screen.getByText('Panel')).toBeInTheDocument(); // Panel (links to /dashboard)
  });

  it('shows links for "owner" role', () => {
    renderWithAuth({ id: '2', role: 'owner', email: 'owner@example.com', name: 'Owner User' }, <Sidebar />);

    expect(screen.getByText('dashboard.title')).toBeInTheDocument(); // Painel (links to /portal for owner if no specific owner dashboard)
    expect(screen.getByText('guests.title')).toBeInTheDocument();
    expect(screen.getByText('rooms.title')).toBeInTheDocument();
    expect(screen.getByText('reservations.title')).toBeInTheDocument();
    expect(screen.getByText('Panel')).toBeInTheDocument(); // Panel (links to /dashboard)
  });

  it('shows links for "attendant" role', () => {
    renderWithAuth({ id: '3', role: 'attendant', email: 'attendant@example.com', name: 'Attendant User' }, <Sidebar />);

    expect(screen.getByText('dashboard.title')).toBeInTheDocument(); // Painel (links to /attendant-dashboard)
    expect(screen.getByText('guests.title')).toBeInTheDocument(); // Attendants can now see guests
    expect(screen.getByText('rooms.title')).toBeInTheDocument();
    expect(screen.getByText('reservations.title')).toBeInTheDocument();
    expect(screen.queryByText('Panel')).not.toBeInTheDocument(); // No "Panel" for attendant
  });

  it('shows minimal links for a generic authenticated user (e.g., "guest" role or no specific role with extended permissions)', () => {
    // Assuming a 'guest' role or a user with no special permissions would only see the portal link
    // and not management sections. The current Sidebar logic defaults to /portal for unrecognised roles.
    renderWithAuth({ id: '4', role: 'guest', email: 'guest@example.com', name: 'Guest User' }, <Sidebar />);

    expect(screen.getByText('dashboard.title')).toBeInTheDocument(); // Painel (links to /portal)
    expect(screen.queryByText('guests.title')).not.toBeInTheDocument();
    expect(screen.queryByText('rooms.title')).not.toBeInTheDocument();
    expect(screen.queryByText('reservations.title')).not.toBeInTheDocument();
    expect(screen.queryByText('Panel')).not.toBeInTheDocument();
  });

  it('navigates to correct dashboard based on role', () => {
    const { rerender } = renderWithAuth({ id: '1', role: 'admin', email: 'admin@example.com', name: 'Admin' }, <Sidebar />);
    let dashboardLink = screen.getByText('dashboard.title').closest('a');
    expect(dashboardLink).toHaveAttribute('href', '/admin-dashboard');

    const mockAuthContextValueOwner: AuthContextType = { user: { id: '2', role: 'owner', email: 'owner@example.com', name: 'Owner' }, isAuthenticated: true, isLoading: false, login: jest.fn(), logout: jest.fn() };
    rerender(
      <AuthContext.Provider value={mockAuthContextValueOwner}>
        <MemoryRouter><Sidebar /></MemoryRouter>
      </AuthContext.Provider>
    );
    dashboardLink = screen.getByText('dashboard.title').closest('a');
    // The main dashboard link in Sidebar.tsx currently sends owner to /portal.
    // The "Panel" link sends them to /dashboard.
    // If the main dashboard should go to /owner-dashboard, Sidebar logic needs update.
    // For now, testing current behavior:
    expect(dashboardLink).toHaveAttribute('href', '/portal'); // Owner's main dashboard link goes to /portal
    // Test the specific "Panel" link for owner
    expect(screen.getByText('Panel').closest('a')).toHaveAttribute('href', '/dashboard');


    const mockAuthContextValueAttendant: AuthContextType = { user: { id: '3', role: 'attendant', email: 'attendant@example.com', name: 'Attendant' }, isAuthenticated: true, isLoading: false, login: jest.fn(), logout: jest.fn() };
    rerender(
        <AuthContext.Provider value={mockAuthContextValueAttendant}>
            <MemoryRouter><Sidebar /></MemoryRouter>
        </AuthContext.Provider>
    );
    dashboardLink = screen.getByText('dashboard.title').closest('a');
    expect(dashboardLink).toHaveAttribute('href', '/attendant-dashboard');
  });
});
