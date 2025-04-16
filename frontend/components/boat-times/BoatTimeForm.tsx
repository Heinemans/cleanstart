import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { BoatTime } from '@/types/boat-time';

interface BoatTimeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<BoatTime, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: BoatTime | null;
  onSuccess?: () => void;
}

export function BoatTimeForm({ isOpen, onClose, onSubmit, initialData, onSuccess }: BoatTimeFormProps) {
  const [formData, setFormData] = useState<Omit<BoatTime, 'id' | 'created_at' | 'updated_at'>>({
    time: '',
    type: 'heen',
    service_type: 'gewoon',
    active: true,
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        time: initialData.time,
        type: initialData.type,
        service_type: initialData.service_type || 'gewoon',
        active: initialData.active,
      });
    } else {
      setFormData({
        time: '',
        type: 'heen',
        service_type: 'gewoon',
        active: true,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {initialData ? 'Boottijd bewerken' : 'Nieuwe boottijd toevoegen'}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tijd
                    </label>
                    <input
                      type="time"
                      id="time"
                      value={formData.time.substring(0, 5)}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Type
                    </label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as 'heen' | 'terug' | 'overig',
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="heen">Heenreis</option>
                      <option value="terug">Terugreis</option>
                      <option value="overig">Overig</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="service_type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Service Type
                    </label>
                    <select
                      id="service_type"
                      value={formData.service_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          service_type: e.target.value as 'gewoon' | 'sneldienst',
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="gewoon">Gewoon</option>
                      <option value="sneldienst">Sneldienst ⚡</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) =>
                        setFormData({ ...formData, active: e.target.checked })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="active"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Actief
                    </label>
                  </div>

                  {initialData && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Aangemaakt op
                        </label>
                        <div className="mt-1 text-sm text-gray-500">
                          {new Date(initialData.created_at).toLocaleString('nl-NL')}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Bijgewerkt op
                        </label>
                        <div className="mt-1 text-sm text-gray-500">
                          {new Date(initialData.updated_at).toLocaleString('nl-NL')}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      {initialData ? 'Bijwerken' : 'Toevoegen'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 