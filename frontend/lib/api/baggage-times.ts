import { BaggageTime } from '@/types/baggage-time';

const FRONTEND_URL = ''; // Leeg betekent relatief ten opzichte van huidige server

export async function getBaggageTimes(): Promise<BaggageTime[]> {
  const response = await fetch(`${FRONTEND_URL}/api/baggage-times`);
  if (!response.ok) {
    throw new Error('Failed to fetch baggage times');
  }
  return response.json();
}

export async function createBaggageTime(data: Omit<BaggageTime, 'id' | 'created_at' | 'updated_at'>): Promise<BaggageTime> {
  const response = await fetch(`${FRONTEND_URL}/api/baggage-times`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create baggage time');
  }
  return response.json();
}

export async function updateBaggageTime(id: number, data: Partial<BaggageTime>): Promise<BaggageTime> {
  const response = await fetch(`${FRONTEND_URL}/api/baggage-times/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update baggage time');
  }
  return response.json();
}

export async function deleteBaggageTime(id: number): Promise<void> {
  const response = await fetch(`${FRONTEND_URL}/api/baggage-times/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete baggage time');
  }
} 