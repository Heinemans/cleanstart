import { BoatTime } from '@/types/boat-time';

const FRONTEND_URL = ''; // Leeg betekent relatief ten opzichte van huidige server

export async function getBoatTimes(): Promise<BoatTime[]> {
  const response = await fetch(`${FRONTEND_URL}/api/boat-times`);
  if (!response.ok) {
    throw new Error('Failed to fetch boat times');
  }
  return response.json();
}

export async function createBoatTime(data: Omit<BoatTime, 'id' | 'created_at' | 'updated_at'>): Promise<BoatTime> {
  const response = await fetch(`${FRONTEND_URL}/api/boat-times`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create boat time');
  }
  return response.json();
}

export async function updateBoatTime(id: number, data: Partial<BoatTime>): Promise<BoatTime> {
  const response = await fetch(`${FRONTEND_URL}/api/boat-times/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update boat time');
  }
  return response.json();
}

export async function deleteBoatTime(id: number): Promise<void> {
  const response = await fetch(`${FRONTEND_URL}/api/boat-times/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete boat time');
  }
} 