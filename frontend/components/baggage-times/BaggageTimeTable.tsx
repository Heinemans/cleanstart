import { BaggageTime } from '@/types/baggage-time';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';

interface BaggageTimeTableProps {
  baggageTimes: BaggageTime[];
  onEdit: (baggageTime: BaggageTime) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number, active: boolean) => void;
  isLoading: boolean;
}

export function BaggageTimeTable({ 
  baggageTimes, 
  onEdit, 
  onDelete, 
  onToggleActive,
  isLoading 
}: BaggageTimeTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (baggageTimes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Geen bagagetijden beschikbaar</p>
      </div>
    );
  }

  // Function to format time string (HH:MM:SS) to HH:MM
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    
    // If it's already in HH:MM format, return as is
    if (timeString.length === 5) return timeString;
    
    // If it's in HH:MM:SS format, remove the seconds
    if (timeString.length === 8) return timeString.substring(0, 5);
    
    return timeString;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'heen': return 'Heenreis';
      case 'terug': return 'Terugreis';
      case 'overig': return 'Overig';
      default: return type;
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tijd
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actief
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aangemaakt op
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bijgewerkt op
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acties
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {baggageTimes.map((baggageTime) => (
            <tr key={baggageTime.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatTime(baggageTime.time)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getTypeLabel(baggageTime.type)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Switch
                  checked={baggageTime.active}
                  onChange={(newActive) => onToggleActive(baggageTime.id, newActive)}
                  className={`${
                    baggageTime.active ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">Actief status wijzigen</span>
                  <span
                    className={`${
                      baggageTime.active ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(baggageTime.created_at).toLocaleString('nl-NL')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(baggageTime.updated_at).toLocaleString('nl-NL')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(baggageTime)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(baggageTime.id)}
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