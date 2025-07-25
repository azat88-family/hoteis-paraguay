// src/apiService/roomService.ts
const API_URL = process.env.REACT_APP_API_URL || '/api';

export interface ActiveGuest {
  id: number; // Or string, depending on your guest ID type
  name: string;
  email: string;
}

export interface Room {
  id: number;
  room_number: string;
  type: string; // 'Standard', 'Deluxe', 'Suite'
  beds: string; // 'Queen', 'Twin', 'King'
  capacity: number;
  price_per_night: number; // Already converted to number in getRooms
  status: string; // 'available', 'occupied', 'reserved', 'cleaning', 'maintenance'
  features: string[]; // {'Wi-Fi', 'TV', 'AC', 'Breakfast'}
  created_at: string;
  active_guest?: ActiveGuest | null; // Added this field
}

export const getRooms = async (): Promise<Room[]> => {
  const response = await fetch(`${API_URL}/rooms`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch rooms' }));
    throw new Error(errorData.message || 'Failed to fetch rooms');
  }
  const rooms = await response.json();
  // Backend now sends active_guest, ensure price_per_night is number
  return rooms.map((room: any) => ({
    ...room,
    price_per_night: parseFloat(room.price_per_night)
    // active_guest is already in the correct shape from the backend
  }));
};

export const getRoomById = async (id: number): Promise<Room> => {
  const response = await fetch(`${API_URL}/rooms/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Failed to fetch room ${id}` }));
    throw new Error(errorData.message || `Failed to fetch room ${id}`);
  }
  const room = await response.json();
  // Ensure price_per_night is number, active_guest should also be fetched if this endpoint is updated similarly
  return {
    ...room,
    price_per_night: parseFloat(room.price_per_night)
  };
};

// Add types for room creation if they differ from Room interface (e.g. omitting id, created_at, active_guest)
export interface CreateRoomData {
  room_number: string;
  type: string;
  beds: string;
  capacity: number;
  price_per_night: number;
  features?: string[];
  status?: string;
}

export const createRoom = async (roomData: CreateRoomData): Promise<Room> => {
  const response = await fetch(`${API_URL}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(roomData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to create room' }));
    throw new Error(errorData.message || 'Failed to create room');
  }
  const room = await response.json();
    // Ensure price_per_night is number
  return {
    ...room,
    price_per_night: parseFloat(room.price_per_night)
  };
};

export interface UpdateRoomData {
  room_number?: string;
  type?: string;
  beds?: string;
  capacity?: number;
  price_per_night?: number;
  status?: string;
  features?: string[];
}

export const updateRoom = async (id: number, roomData: UpdateRoomData): Promise<Room> => {
  const response = await fetch(`${API_URL}/rooms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(roomData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Failed to update room ${id}` }));
    throw new Error(errorData.message || `Failed to update room ${id}`);
  }
  const room = await response.json();
  // Ensure price_per_night is number
  return {
    ...room,
    price_per_night: parseFloat(room.price_per_night)
  };
};

export const deleteRoom = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/rooms/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Failed to delete room ${id}` }));
    throw new Error(errorData.message || `Failed to delete room ${id}`);
  }
};
