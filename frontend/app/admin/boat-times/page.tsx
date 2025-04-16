'use client';

import { useState, useEffect } from 'react';
import { BoatTimeTable } from '@/components/boat-times/BoatTimeTable';
import { BoatTimeForm } from '@/components/boat-times/BoatTimeForm';
import {
  getBoatTimes,
  createBoatTime,
  updateBoatTime,
  deleteBoatTime
} from '@/lib/api/boat-times';
import { BoatTime } from '@/types/boat-time';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function BoatTimesPage() {
  const [boatTimes, setBoatTimes] = useState<BoatTime[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBoatTime, setSelectedBoatTime] = useState<BoatTime | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBoatTimes();
  }, []);

  const fetchBoatTimes = async () => {
    try {
      const data = await getBoatTimes();
      setBoatTimes(data);
    } catch (error) {
      toast.error('Laden van boottijden mislukt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: Omit<BoatTime, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createBoatTime(data);
      toast.success('Boottijd toegevoegd!');
      fetchBoatTimes();
      setIsFormOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Toevoegen mislukt');
    }
  };

  const handleUpdate = async (id: number, data: Partial<BoatTime>) => {
    try {
      await updateBoatTime(id, data);
      toast.success('Boottijd bijgewerkt!');
      fetchBoatTimes();
      setIsFormOpen(false);
      setSelectedBoatTime(null);
    } catch (error: any) {
      toast.error(error.message || 'Bijwerken mislukt');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Weet je zeker dat je deze boottijd wilt verwijderen?')) {
      try {
        await deleteBoatTime(id);
        toast.success('Boottijd verwijderd!');
        fetchBoatTimes();
      } catch (error) {
        toast.error('Verwijderen mislukt');
      }
    }
  };

  const handleToggleActive = async (id: number, active: boolean) => {
    try {
      await updateBoatTime(id, { active });
      toast.success(`Boottijd ${active ? 'geactiveerd' : 'gedeactiveerd'}!`);
      fetchBoatTimes();
    } catch (error) {
      toast.error('Status wijzigen mislukt');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link 
          href="/dashboard" 
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Terug naar Dashboard
        </Link>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Boottijden</h1>
        <button
          onClick={() => {
            setSelectedBoatTime(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>+</span>
          <span>Nieuwe tijd toevoegen</span>
        </button>
      </div>

      <BoatTimeTable
        boatTimes={boatTimes}
        onEdit={(boatTime) => {
          setSelectedBoatTime(boatTime);
          setIsFormOpen(true);
        }}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        isLoading={isLoading}
      />

      <BoatTimeForm
        key={selectedBoatTime?.id || 'new'}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedBoatTime(null);
        }}
        onSubmit={selectedBoatTime 
          ? (data) => handleUpdate(selectedBoatTime.id, data) 
          : handleCreate
        }
        initialData={selectedBoatTime}
        onSuccess={() => {
          fetchBoatTimes();
          setIsFormOpen(false);
        }}
      />
    </div>
  );
} 