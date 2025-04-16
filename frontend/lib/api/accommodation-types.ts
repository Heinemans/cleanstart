import { AccommodationType } from '@/types/accommodation-type';

export const getAccommodationTypes = async (): Promise<AccommodationType[]> => {
  const response = await fetch('/api/accommodation-types');
  if (!response.ok) {
    throw new Error('Failed to fetch accommodation types');
  }
  return response.json();
};

export const createAccommodationType = async (data: Omit<AccommodationType, 'id' | 'created_at'>): Promise<Response> => {
  const response = await fetch('/api/accommodation-types', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to create accommodation type');
  }
  return response;
};

export const updateAccommodationType = async (id: number, data: Partial<AccommodationType>): Promise<Response> => {
  const response = await fetch(`/api/accommodation-types/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to update accommodation type');
  }
  return response;
};

export const deleteAccommodationType = async (id: number): Promise<void> => {
  const response = await fetch(`/api/accommodation-types/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete accommodation type');
  }
}; 