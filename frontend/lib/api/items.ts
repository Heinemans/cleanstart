import { Item } from "@/types/item"

const API_URL = process.env.NEXT_PUBLIC_API_URL
// De frontend API draait op dezelfde server als de Next.js applicatie
const FRONTEND_URL = ''; // Leeg betekent relatief ten opzichte van huidige server

export async function getItems(): Promise<Item[]> {
  const response = await fetch(`${FRONTEND_URL}/api/items`)
  if (!response.ok) {
    throw new Error('Failed to fetch items')
  }
  return response.json()
}

export async function createItem(data: Omit<Item, 'id' | 'created_at' | 'updated_at'>): Promise<Item> {
  const response = await fetch(`${FRONTEND_URL}/api/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create item')
  }
  return response.json()
}

export async function updateItem(id: number, data: Partial<Item>): Promise<Item> {
  const response = await fetch(`${FRONTEND_URL}/api/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update item')
  }
  return response.json()
}

export async function deleteItem(id: number): Promise<void> {
  const response = await fetch(`${FRONTEND_URL}/api/items/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete item')
  }
} 