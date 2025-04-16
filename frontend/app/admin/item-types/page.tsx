"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ItemTypeForm } from "./components/ItemTypeForm"
import { ItemTypeTable } from "./components/ItemTypeTable"
import { ItemType } from "@/types/item-type"
import { getItemTypes } from "@/lib/api/item-types"

export default function ItemTypesPage() {
  const [itemTypes, setItemTypes] = useState<ItemType[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedItemType, setSelectedItemType] = useState<ItemType | undefined>(undefined)

  useEffect(() => {
    getItemTypes().then(setItemTypes)
  }, [])

  const handleEdit = (itemType: ItemType) => {
    setSelectedItemType(itemType)
    setShowForm(true)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Item Types</h1>
        <button
          onClick={() => {
            setSelectedItemType(undefined)
            setShowForm(true)
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Item Type
        </button>
      </div>

      <ItemTypeTable 
        data={itemTypes} 
        onUpdated={setItemTypes} 
        onEdit={handleEdit}
      />

      <ItemTypeForm 
        open={showForm} 
        setOpen={setShowForm} 
        onSaved={setItemTypes}
        initialData={selectedItemType}
      />
    </div>
  )
}
