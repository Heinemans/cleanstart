'use client';

import { useState, useEffect } from 'react';
import { AccommodationType } from '@/types/accommodation-type';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { toast } from '@/components/ui/use-toast';
import { createAccommodationType, updateAccommodationType, getAccommodationTypes } from '@/lib/api/accommodation-types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface AccommodationTypeFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSaved: (data: AccommodationType[]) => void;
  initialData?: AccommodationType;
}

type FormData = {
  name: string;
  active: boolean;
};

export function AccommodationTypeForm({ open, setOpen, onSaved, initialData }: AccommodationTypeFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    active: true,
  });
  const [loading, setLoading] = useState(false);

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        active: initialData.active,
      });
    } else {
      setFormData({
        name: '',
        active: true,
      });
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Fout",
        description: "Naam is verplicht",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      if (initialData) {
        await updateAccommodationType(initialData.id, formData);
        toast({
          title: "Succes",
          description: "Accommodatietype succesvol bijgewerkt",
        });
      } else {
        await createAccommodationType(formData);
        toast({
          title: "Succes",
          description: "Accommodatietype succesvol aangemaakt",
        });
      }

      const refreshedData = await getAccommodationTypes();
      onSaved(refreshedData);
      setOpen(false);
    } catch (error) {
      toast({
        title: "Fout",
        description: error instanceof Error ? error.message : "Er is iets misgegaan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
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
                  {initialData ? 'Accommodatietype bewerken' : 'Nieuw accommodatietype'}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Naam
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, active: checked })
                      }
                    />
                    <Label htmlFor="active">Actief</Label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      {loading ? 'Opslaan...' : initialData ? 'Bijwerken' : 'Aanmaken'}
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