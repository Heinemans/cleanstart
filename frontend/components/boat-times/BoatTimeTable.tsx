import { BoatTime } from '@/types/boat-time';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';

interface BoatTimeTableProps {
  boatTimes: BoatTime[];
  onEdit: (boatTime: BoatTime) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number, active: boolean) => void;
  isLoading: boolean;
}

export function BoatTimeTable({ 
  boatTimes, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  isLoading 
}: BoatTimeTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (boatTimes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Geen boottijden beschikbaar</p>
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

  const translateType = (type: string) => {
    switch (type) {
      case 'heen': return 'Heenreis';
      case 'terug': return 'Terugreis';
      case 'overig': return 'Overig';
      default: return type;
    }
  };

  const translateServiceType = (serviceType: string) => {
    switch (serviceType) {
      case 'gewoon': return 'Gewoon';
      case 'sneldienst': return 'Sneldienst';
      default: return serviceType;
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
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acties
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {boatTimes.map((boatTime) => (
            <tr key={boatTime.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatTime(boatTime.time)}
                {boatTime.service_type === 'sneldienst' && <span className="ml-1">⚡</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {translateType(boatTime.type)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {translateServiceType(boatTime.service_type || 'gewoon')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Switch
                  checked={boatTime.active}
                  onChange={(newState) => onToggleActive(boatTime.id, newState)}
                  className={`${
                    boatTime.active ? 'bg-green-500' : 'bg-gray-300'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span
                    className={`${
                      boatTime.active ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(boatTime)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(boatTime.id)}
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