// src/apiService/reservationService.ts
import type { Guest } from './guestService';
import type { Room } from './roomService';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export interface Reservation {
  id: number;
  guest_id: number;
  room_id: number;
  check_in_date: string; // ISO date string
  check_out_date: string; // ISO date string
  total_amount: number; // Comes as string from backend due to DECIMAL, convert to number
  payment_status: string; // 'pending', 'paid', 'partially_paid'
  payment_method?: string; // 'credit_card', 'cash'
  created_at: string;
  guests?: Guest; // For joined data
  rooms?: Pick<Room, 'id' | 'room_number' | 'type'>; // For joined data
}

export interface CreateReservationData {
  guest_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  payment_status?: string;
  payment_method?: string;
}

export interface UpdateReservationData {
  guest_id?: number;
  room_id?: number;
  check_in_date?: string;
  check_out_date?: string;
  total_amount?: number;
  payment_status?: string;
  payment_method?: string;
}

const processReservation = (reservation: any): Reservation => ({
  ...reservation,
  total_amount: parseFloat(reservation.total_amount),
});

export const getReservations = async (): Promise<Reservation[]> => {
  const response = await fetch(`${API_URL}/reservations`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch reservations' }));
    throw new Error(errorData.message || 'Failed to fetch reservations');
  }
  const reservations = await response.json();
  return reservations.map(processReservation);
};

export const getReservationById = async (id: number): Promise<Reservation> => {
  const response = await fetch(`${API_URL}/reservations/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Failed to fetch reservation ${id}` }));
    throw new Error(errorData.message || `Failed to fetch reservation ${id}`);
  }
  const reservation = await response.json();
  return processReservation(reservation);
};

export const createReservation = async (reservationData: CreateReservationData): Promise<Reservation> => {
  const response = await fetch(`${API_URL}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservationData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to create reservation' }));
    throw new Error(errorData.message || 'Failed to create reservation');
  }
  const reservation = await response.json();
  // The backend route for POST reservation returns an array with a single element
  return processReservation(reservation[0] || reservation);
};

export const updateReservation = async (id: number, reservationData: UpdateReservationData): Promise<Reservation> => {
  const response = await fetch(`${API_URL}/reservations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservationData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Failed to update reservation ${id}` }));
    throw new Error(errorData.message || `Failed to update reservation ${id}`);
  }
  const reservation = await response.json();
    // The backend route for PUT reservation returns an array with a single element
  return processReservation(reservation[0] || reservation);
};

export const deleteReservation = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/reservations/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    // DELETE might not return JSON, or might return error details as JSON
    const contentType = response.headers.get("content-type");
    let errorMessage = `Failed to delete reservation ${id}`;
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json().catch(() => ({}));
        errorMessage = errorData.message || errorData.error || errorMessage;
    } else {
        const textError = await response.text().catch(() => "");
        if(textError) errorMessage = textError;
    }
    throw new Error(errorMessage);
  }
  // DELETE typically returns 204 No Content
};
