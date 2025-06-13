// src/apiService/guestService.ts
const API_URL = process.env.REACT_APP_API_URL || '/api'; // Use environment variable or default

export interface Guest {
  id: number;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
}

export const getGuests = async (): Promise<Guest[]> => {
  const response = await fetch(`${API_URL}/guests`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch guests' }));
    throw new Error(errorData.message || 'Failed to fetch guests');
  }
  return response.json();
};

export const createGuest = async (guestData: Omit<Guest, 'id' | 'created_at'>): Promise<Guest> => {
  const response = await fetch(`${API_URL}/guests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(guestData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to create guest' }));
    throw new Error(errorData.message || 'Failed to create guest');
  }
  return response.json();
};

export const getGuestById = async (id: number): Promise<Guest> => {
  const response = await fetch(`${API_URL}/guests/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Failed to fetch guest ${id}` }));
    throw new Error(errorData.message || `Failed to fetch guest ${id}`);
  }
  return response.json();
};

export const updateGuest = async (id: number, guestData: Partial<Omit<Guest, 'id' | 'created_at'>>): Promise<Guest> => {
  const response = await fetch(`${API_URL}/guests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(guestData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Failed to update guest ${id}` }));
    throw new Error(errorData.message || `Failed to update guest ${id}`);
  }
  return response.json();
};

export const deleteGuest = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/guests/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Failed to delete guest ${id}` }));
    throw new Error(errorData.message || `Failed to delete guest ${id}`);
  }
  // DELETE typically returns 204 No Content, so no JSON to parse
};
