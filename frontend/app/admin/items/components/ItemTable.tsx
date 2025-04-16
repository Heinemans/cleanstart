"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import { Item } from "@/types/item"
import { deleteItem } from "@/lib/api/items"
import { useToast } from "@/components/ui/use-toast"

interface ItemTableProps {
  data: Item[]
  onUpdated: (items: Item[]) => void
  onEdit: (item: Item) => void
  isLoading?: boolean
}

export function ItemTable({ data, onUpdated, onEdit, isLoading = false }: ItemTableProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  
  // Debug log om te zien wat er in de data zit
  console.log("ItemTable data:", data);
  
  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(id)
      await deleteItem(id)
      toast({
        title: "Success",
        description: "Item deleted successfully",
      })
      const updatedItems = data.filter((item) => item.id !== id)
      onUpdated(updatedItems)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-md border p-8">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin"></div>
          <p className="mt-4 text-gray-500">Laden...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-md border p-8">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500">Geen items gevonden</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Number</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Model Type</TableHead>
            <TableHead>Frame Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Item Type</TableHead>
            <TableHead>Price Code</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.item_number}</TableCell>
              <TableCell>{item.brand}</TableCell>
              <TableCell>{item.model_type}</TableCell>
              <TableCell>{item.frame_number}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === "available"
                      ? "bg-green-100 text-green-800"
                      : item.status === "maintenance"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                {item.item_type?.name || 
                  <span title={`item_type_id: ${item.item_type_id}, typeof: ${typeof item.item_type}`}>
                    -
                  </span>
                }
              </TableCell>
              <TableCell>
                {item.price_code && item.price_code.code ? 
                  item.price_code.code : 
                  <span title={`price_code_id: ${item.price_code_id}, typeof: ${typeof item.price_code}`}>
                    -
                  </span>
                }
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="h-8 w-8"
                    disabled={isDeleting === item.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 