import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RoomCard from '../RoomCard';
import { Room } from '../../../apiService/roomService';
import { AuthContext, AuthContextType } from '../../../contexts/AuthContext';
import { User } from '../../../contexts/AuthContext';

// Mock useTranslation
const mockT = jest.fn((key, optionsOrFallback) => {
    if (typeof optionsOrFallback === 'string' && optionsOrFallback) {
        return optionsOrFallback; // Return fallback string if provided
    }
    if (typeof optionsOrFallback === 'object' && optionsOrFallback && 'count' in optionsOrFallback) {
        return `${key}_${optionsOrFallback.count}`; // Basic plural mock
    }
    return key; // Otherwise, return the key itself
});

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: mockT })
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // Retain other exports
    useNavigate: () => mockNavigate,
}));

// Mock RoomManageModal to prevent its complex rendering/logic from affecting these tests
jest.mock('../RoomManageModal', () => () => <div data-testid="room-manage-modal-mock">RoomManageModal</div>);


const mockDefaultUser: User = { id: '1', name: 'Test User', email: 'test@example.com', role: 'admin' };

const renderWithAuth = (user: User | null, ui: React.ReactElement) => {
  const mockAuthContextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: false,
    login: jest.fn().mockResolvedValue(true),
    logout: jest.fn(),
  };
  return render(
    <AuthContext.Provider value={mockAuthContextValue}>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
};

const mockBaseRoom: Room = {
  id: 1,
  room_number: '101',
  type: 'Standard',
  beds: 'Queen',
  capacity: 2,
  price_per_night: 120.00,
  status: 'available',
  features: ['Wi-Fi', 'TV'],
  created_at: new Date().toISOString(),
};

describe('RoomCard', () => {
  beforeEach(() => {
    mockT.mockClear();
    mockNavigate.mockClear();
  });

  it('renders basic room information correctly', () => {
    renderWithAuth(mockDefaultUser, <RoomCard room={mockBaseRoom} />);
    expect(screen.getByText(mockBaseRoom.room_number)).toBeInTheDocument();
    expect(screen.getByText(mockT(`rooms.types.${mockBaseRoom.type.toLowerCase()}`, mockBaseRoom.type))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${mockBaseRoom.price_per_night.toFixed(2)}`))).toBeInTheDocument();
    expect(screen.getByText(mockT('rooms.status.available'))).toBeInTheDocument();
  });

  describe('Resilience to Incomplete or Invalid Data', () => {
    it('should render fallback for price if price_per_night is NaN', () => {
      const roomWithInvalidPrice: Room = { ...mockBaseRoom, price_per_night: NaN };
      renderWithAuth(mockDefaultUser, <RoomCard room={roomWithInvalidPrice} />);
      // Assuming t('common.notAvailableShort', 'N/A') is used as fallback
      expect(screen.getByText(`$${mockT('common.notAvailableShort', 'N/A')}`)).toBeInTheDocument();
      // Check that "/ night" is still there or handled gracefully
      expect(screen.getByText(new RegExp(`/ ${mockT('rooms.night', 'night')}`))).toBeInTheDocument();
    });

    it('should render fallback for price if price_per_night is null', () => {
        const roomWithNullPrice: Room = { ...mockBaseRoom, price_per_night: null as any };
        renderWithAuth(mockDefaultUser, <RoomCard room={roomWithNullPrice} />);
        expect(screen.getByText(`$${mockT('common.notAvailableShort', 'N/A')}`)).toBeInTheDocument();
    });

    it('should render fallback for type if room.type is null', () => {
      const roomWithNullType: Room = { ...mockBaseRoom, type: null as any };
      renderWithAuth(mockDefaultUser, <RoomCard room={roomWithNullType} />);
      // RoomCard uses: t(typeKey, defaultRoomType) where defaultRoomType is room.type || t('common.unknownType', 'Unknown Type')
      // So, it will try to translate rooms.types.unknown, and if not found, use 'Unknown Type'
      expect(screen.getByText(mockT('common.unknownType', 'Unknown Type'))).toBeInTheDocument();
    });

    it('should render fallback for beds if room.beds is undefined', () => {
      const roomWithUndefinedBeds: Room = { ...mockBaseRoom, beds: undefined as any };
      renderWithAuth(mockDefaultUser, <RoomCard room={roomWithUndefinedBeds} />);
      expect(screen.getByText(mockT('common.unknownBeds', 'Unknown Beds'))).toBeInTheDocument();
    });

    it('should render fallback for room_number if room.room_number is null', () => {
      const roomWithNullRoomNumber: Room = { ...mockBaseRoom, room_number: null as any };
      renderWithAuth(mockDefaultUser, <RoomCard room={roomWithNullRoomNumber} />);
      expect(screen.getByText(mockT('common.unknownRoom', 'Unknown Room'))).toBeInTheDocument();
    });

    it('should render 0 for capacity if room.capacity is null', () => {
      const roomWithNullCapacity: Room = { ...mockBaseRoom, capacity: null as any };
      renderWithAuth(mockDefaultUser, <RoomCard room={roomWithNullCapacity} />);
      // Logic: {room.capacity || 0} {t( (room.capacity || 0) > 1 ? 'rooms.guests' : 'rooms.guest', { count: room.capacity || 0 })}
      // This will result in "0" followed by the singular guest translation.
      expect(screen.getByText(new RegExp(`0 ${mockT('rooms.guest', 'guest')}`))).toBeInTheDocument();
    });

    it('should handle undefined features array gracefully', () => {
        const roomWithUndefinedFeatures: Room = { ...mockBaseRoom, features: undefined as any };
        renderWithAuth(mockDefaultUser, <RoomCard room={roomWithUndefinedFeatures} />);
        // Expect no error and the features section to likely not render or render an empty state
        // Check for a known element that should still be there
        expect(screen.getByText(mockBaseRoom.room_number)).toBeInTheDocument();
        expect(screen.queryByText(mockT('rooms.featuresTitle', 'Features'))).not.toBeInTheDocument();
    });

    it('should handle null feature strings in features array', () => {
        const roomWithNullInFeatures: Room = { ...mockBaseRoom, features: ['Wi-Fi', null as any, 'TV'] };
        renderWithAuth(mockDefaultUser, <RoomCard room={roomWithNullInFeatures} />);
        expect(screen.getByText(mockT('rooms.features.wi-fi', 'Wi-Fi'))).toBeInTheDocument();
        expect(screen.getByText(mockT('rooms.features.tv', 'TV'))).toBeInTheDocument();
        // It should try to translate rooms.features.unknown or render empty string for the null feature
        // Depending on mockT, it might render 'rooms.features.unknown' or ''
        // For this test, ensuring it doesn't crash and valid features are there is key.
    });
  });
});
