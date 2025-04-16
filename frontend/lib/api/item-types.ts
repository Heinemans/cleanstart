import { ItemType } from '@/types/item-type';

export const getItemTypes = async (): Promise<ItemType[]> => {
  const response = await fetch('/api/item-types');
  if (!response.ok) {
    throw new Error('Failed to fetch item types');
  }
  return response.json();
};

export const createItemType = async (data: Omit<ItemType, 'id'>): Promise<Response> => {
  const response = await fetch('/api/item-types', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to create item type');
  }
  return response;
};

export const updateItemType = async (id: number, data: Partial<ItemType>): Promise<Response> => {
  const response = await fetch(`/api/item-types/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to update item type');
  }
  return response;
};

export const deleteItemType = async (id: number): Promise<void> => {
  const response = await fetch(`/api/item-types/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete item type');
  }
}; 