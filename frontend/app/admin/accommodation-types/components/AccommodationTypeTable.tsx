'use client';

import { useState } from 'react';
import { AccommodationType } from '@/types/accommodation-type';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from '@/components/ui/use-toast';
import { deleteAccommodationType } from '@/lib/api/accommodation-types';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';

interface AccommodationTypeTableProps {
  data: AccommodationType[];
  onUpdated: (data: AccommodationType[]) => void;
  onEdit?: (accommodationType: AccommodationType) => void;
  onToggleActive?: (id: number, active: boolean) => void;
}

export function AccommodationTypeTable({ 
  data, 
  onUpdated, 
  onEdit,
  onToggleActive 
}: AccommodationTypeTableProps) {
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
        <p className="text-gray-500">Geen accommodatietypes beschikbaar</p>
      </div>
    );
  }

  const handleEdit = (accommodationType: AccommodationType) => {
    if (onEdit) {
      onEdit(accommodationType);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Weet je zeker dat je dit accommodatietype wilt verwijderen?')) {
      try {
        setIsLoading(true);
        await deleteAccommodationType(id);
        toast({
          title: "Succes",
          description: "Accommodatietype succesvol verwijderd",
        });
        // Refetch data after delete
        const response = await fetch('/api/accommodation-types');
        const updatedData = await response.json();
        onUpdated(updatedData);
      } catch (error) {
        toast({
          title: "Fout",
          description: "Kon accommodatietype niet verwijderen",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleActive = async (id: number, active: boolean) => {
    if (onToggleActive) {
      onToggleActive(id, active);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd-MM-yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Naam
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actief
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aangemaakt op
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acties
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((accommodationType) => (
            <tr key={accommodationType.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {accommodationType.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {accommodationType.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Switch 
                  checked={accommodationType.active} 
                  onCheckedChange={(checked) => handleToggleActive(accommodationType.id, checked)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(accommodationType.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(accommodationType)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(accommodationType.id)}
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