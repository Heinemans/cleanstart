"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { ItemForm } from "./components/ItemForm"
import { ItemTable } from "./components/ItemTable"
import { Item } from "@/types/item"
import { getItems } from "@/lib/api/items"

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getItems()
        setItems(data)
      } catch (err) {
        console.error("Error fetching items:", err)
        setError("Er is een probleem opgetreden bij het laden van de items. Probeer het later opnieuw.")
        // Toon lege lijst als fallback
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleEdit = (item: Item) => {
    setSelectedItem(item)
    setShowForm(true)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Items</h1>
        <button
          onClick={() => {
            setSelectedItem(undefined)
            setShowForm(true)
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <ItemTable 
        data={items} 
        onUpdated={setItems} 
        onEdit={handleEdit}
        isLoading={loading}
      />

      <ItemForm 
        open={showForm} 
        setOpen={setShowForm} 
        onSaved={setItems}
        initialData={selectedItem}
      />
    </div>
  )
} 