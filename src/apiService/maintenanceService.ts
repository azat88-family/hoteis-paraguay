// src/apiService/maintenanceService.ts
import type { Room } from './roomService';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export interface MaintenanceRequest {
  id: number;
  room_id: number;
  description: string;
  status: string; // 'pending', 'in_progress', 'completed'
  priority: string; // 'low', 'medium', 'high'
  reported_at: string; // ISO date string
  completed_at?: string | null; // ISO date string
  rooms?: Pick<Room, 'id' | 'room_number'>; // For joined data
}

export interface CreateMaintenanceRequestData {
  room_id: number;
  description: string;
  priority?: string;
  status?: string; // Default is 'pending' on backend
}

export interface UpdateMaintenanceRequestData {
  room_id?: number;
  description?: string;
  status?: string;
  priority?: string;
  completed_at?: string | null;
}

const processMaintenanceRequest = (request: any): MaintenanceRequest => ({
  ...request,
  // Any specific processing needed for maintenance request fields can go here
});

export const getMaintenanceRequests = async (): Promise<MaintenanceRequest[]> => {
  const response = await fetch(`${API_URL}/maintenance`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch maintenance requests' }));
    throw new Error(errorData.message || 'Failed to fetch maintenance requests');
  }
  const requests = await response.json();
  return requests.map(processMaintenanceRequest);
};

export const getMaintenanceRequestById = async (id: number): Promise<MaintenanceRequest> => {
  const response = await fetch(`${API_URL}/maintenance/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Failed to fetch maintenance request ${id}` }));
    throw new Error(errorData.message || `Failed to fetch maintenance request ${id}`);
  }
  const request = await response.json();
  return processMaintenanceRequest(request);
};

export const createMaintenanceRequest = async (requestData: CreateMaintenanceRequestData): Promise<MaintenanceRequest> => {
  const response = await fetch(`${API_URL}/maintenance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to create maintenance request' }));
    throw new Error(errorData.message || 'Failed to create maintenance request');
  }
  const request = await response.json();
  // The backend route for POST maintenance returns an array with a single element
  return processMaintenanceRequest(request[0] || request);
};

export const updateMaintenanceRequest = async (id: number, requestData: UpdateMaintenanceRequestData): Promise<MaintenanceRequest> => {
  const response = await fetch(`${API_URL}/maintenance/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Failed to update maintenance request ${id}` }));
    throw new Error(errorData.message || `Failed to update maintenance request ${id}`);
  }
  const request = await response.json();
    // The backend route for PUT maintenance returns an array with a single element
  return processMaintenanceRequest(request[0] || request);
};

// Delete for maintenance requests might not be common, but can be added if needed
// export const deleteMaintenanceRequest = async (id: number): Promise<void> => {
//   const response = await fetch(`${API_URL}/maintenance/${id}`, {
//     method: 'DELETE',
//   });
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({ message: `Failed to delete maintenance request ${id}` }));
//     throw new Error(errorData.message || `Failed to delete maintenance request ${id}`);
//   }
// };
