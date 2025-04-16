import { PriceListLink, PriceListLinkWithDetails } from '@/types/price-list-link';

export async function getPriceListLinks(): Promise<PriceListLinkWithDetails[]> {
  const response = await fetch('/api/price-list-links');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch price list links');
  }
  
  return response.json();
}

export async function createPriceListLink(data: Omit<PriceListLink, 'id' | 'created_at' | 'updated_at'>): Promise<PriceListLink> {
  const response = await fetch('/api/price-list-links', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create price list link' }));
    throw new Error(error.message || 'Failed to create price list link');
  }
  
  return response.json();
}

export async function updatePriceListLink(
  id: number,
  data: Partial<Omit<PriceListLink, 'id' | 'created_at' | 'updated_at'>>
): Promise<PriceListLink> {
  const response = await fetch(`/api/price-list-links/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update price list link' }));
    throw new Error(error.message || 'Failed to update price list link');
  }
  
  return response.json();
}

export async function deletePriceListLink(id: number): Promise<void> {
  const response = await fetch(`/api/price-list-links/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to delete price list link' }));
    throw new Error(error.message || 'Failed to delete price list link');
  }
} 