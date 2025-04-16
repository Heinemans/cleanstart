'use client';

import { useState } from 'react';
import { ItemType } from '@/types/item-type';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from '@/components/ui/use-toast';
import { deleteItemType } from '@/lib/api/item-types';

interface ItemTypeTableProps {
  data: ItemType[];
  onUpdated: (data: ItemType[]) => void;
  onEdit?: (itemType: ItemType) => void;
}

export function ItemTypeTable({ data, onUpdated, onEdit }: ItemTypeTableProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No item types available</p>
      </div>
    );
  }

  const handleEdit = (itemType: ItemType) => {
    if (onEdit) {
      onEdit(itemType);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item type?')) {
      try {
        setIsLoading(true);
        await deleteItemType(id);
        toast({
          title: "Success",
          description: "Item type deleted successfully",
        });
        // Refetch data after delete
        const response = await fetch('/api/item-types');
        const updatedData = await response.json();
        onUpdated(updatedData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete item type",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((itemType) => (
            <tr key={itemType.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {itemType.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {itemType.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(itemType)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(itemType.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 