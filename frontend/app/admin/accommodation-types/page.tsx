"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AccommodationTypeForm } from "./components/AccommodationTypeForm"
import { AccommodationTypeTable } from "./components/AccommodationTypeTable"
import { AccommodationType } from "@/types/accommodation-type"
import { getAccommodationTypes, updateAccommodationType } from "@/lib/api/accommodation-types"
import { toast } from "@/components/ui/use-toast"

export default function AccommodationTypesPage() {
  const [accommodationTypes, setAccommodationTypes] = useState<AccommodationType[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedAccommodationType, setSelectedAccommodationType] = useState<AccommodationType | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAccommodationTypes()
  }, [])

  const fetchAccommodationTypes = async () => {
    try {
      setIsLoading(true)
      const data = await getAccommodationTypes()
      setAccommodationTypes(data)
    } catch (error) {
      toast({
        title: "Fout",
        description: "Kon accommodatietypes niet laden",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (accommodationType: AccommodationType) => {
    setSelectedAccommodationType(accommodationType)
    setShowForm(true)
  }

  const handleToggleActive = async (id: number, active: boolean) => {
    try {
      await updateAccommodationType(id, { active })
      
      // Update local state to reflect the change
      setAccommodationTypes(prev => 
        prev.map(item => 
          item.id === id ? { ...item, active } : item
        )
      )
      
      toast({
        title: "Succes",
        description: `Accommodatietype is nu ${active ? 'actief' : 'inactief'}`,
      })
    } catch (error) {
      toast({
        title: "Fout",
        description: "Kon status niet bijwerken",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Accommodatietypes</h1>
        <button
          onClick={() => {
            setSelectedAccommodationType(undefined)
            setShowForm(true)
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nieuw Accommodatietype
        </button>
      </div>

      <AccommodationTypeTable 
        data={accommodationTypes} 
        onUpdated={setAccommodationTypes} 
        onEdit={handleEdit}
        onToggleActive={handleToggleActive}
      />

      <AccommodationTypeForm 
        open={showForm} 
        setOpen={setShowForm} 
        onSaved={setAccommodationTypes}
        initialData={selectedAccommodationType}
      />
    </div>
  )
} 