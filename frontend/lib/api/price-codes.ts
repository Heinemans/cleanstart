import { PriceCode } from '@/types/price-code';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
// De frontend API draait op dezelfde server als de Next.js applicatie
const FRONTEND_URL = ''; // Leeg betekent relatief ten opzichte van huidige server

export async function getPriceCodes(): Promise<PriceCode[]> {
  const response = await fetch(`${FRONTEND_URL}/api/price-codes`);
  if (!response.ok) {
    throw new Error('Failed to fetch price codes');
  }
  return response.json();
}

export async function createPriceCode(data: Omit<PriceCode, 'id' | 'created_at' | 'updated_at'>): Promise<PriceCode> {
  const response = await fetch(`${FRONTEND_URL}/api/price-codes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create price code');
  }
  return response.json();
}

export async function updatePriceCode(id: number, data: Partial<PriceCode>): Promise<PriceCode> {
  const response = await fetch(`${FRONTEND_URL}/api/price-codes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update price code');
  }
  return response.json();
}

export async function deletePriceCode(id: number): Promise<void> {
  const response = await fetch(`${FRONTEND_URL}/api/price-codes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete price code');
  }
} 