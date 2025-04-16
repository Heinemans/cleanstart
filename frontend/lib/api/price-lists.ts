import { PriceList } from '@/types/price-list';

export async function getPriceLists(): Promise<PriceList[]> {
  const response = await fetch('/api/price-lists');
  if (!response.ok) {
    throw new Error('Failed to fetch price lists');
  }
  return response.json();
}

export const priceListApi = {
  getAll: async (): Promise<PriceList[]> => {
    return getPriceLists();
  },

  create: async (data: Omit<PriceList, 'id'>): Promise<PriceList> => {
    const response = await fetch('/api/price-lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create price list');
    }
    return response.json();
  },

  update: async (id: number, data: Partial<PriceList>): Promise<PriceList> => {
    const response = await fetch(`/api/price-lists/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update price list');
    }
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`/api/price-lists/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete price list');
    }
  },
}; 