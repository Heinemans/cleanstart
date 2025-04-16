'use client';

import { useState, useEffect } from 'react';
import { BaggageTimeTable } from '@/components/baggage-times/BaggageTimeTable';
import { BaggageTimeForm } from '@/components/baggage-times/BaggageTimeForm';
import {
  getBaggageTimes,
  createBaggageTime,
  updateBaggageTime,
  deleteBaggageTime
} from '@/lib/api/baggage-times';
import { BaggageTime } from '@/types/baggage-time';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function BaggageTimesPage() {
  const [baggageTimes, setBaggageTimes] = useState<BaggageTime[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBaggageTime, setSelectedBaggageTime] = useState<BaggageTime | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBaggageTimes();
  }, []);

  const fetchBaggageTimes = async () => {
    try {
      const data = await getBaggageTimes();
      setBaggageTimes(data);
    } catch (error) {
      toast.error('Laden van bagagetijden mislukt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: Omit<BaggageTime, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createBaggageTime(data);
      toast.success('Bagagetijd toegevoegd!');
      fetchBaggageTimes();
      setIsFormOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Toevoegen mislukt');
    }
  };

  const handleUpdate = async (id: number, data: Partial<BaggageTime>) => {
    try {
      await updateBaggageTime(id, data);
      toast.success('Bagagetijd bijgewerkt!');
      fetchBaggageTimes();
      setIsFormOpen(false);
      setSelectedBaggageTime(null);
    } catch (error: any) {
      toast.error(error.message || 'Bijwerken mislukt');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Weet je zeker dat je deze bagagetijd wilt verwijderen?')) {
      try {
        await deleteBaggageTime(id);
        toast.success('Bagagetijd verwijderd!');
        fetchBaggageTimes();
      } catch (error) {
        toast.error('Verwijderen mislukt');
      }
    }
  };

  const handleToggleActive = async (id: number, active: boolean) => {
    try {
      await updateBaggageTime(id, { active });
      toast.success(`Bagagetijd ${active ? 'geactiveerd' : 'gedeactiveerd'}!`);
      fetchBaggageTimes();
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
        <h1 className="text-2xl font-bold">Bagagetijden</h1>
        <button
          onClick={() => {
            setSelectedBaggageTime(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>+</span>
          <span>Nieuwe tijd toevoegen</span>
        </button>
      </div>

      <BaggageTimeTable
        baggageTimes={baggageTimes}
        onEdit={(baggageTime) => {
          setSelectedBaggageTime(baggageTime);
          setIsFormOpen(true);
        }}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        isLoading={isLoading}
      />

      <BaggageTimeForm
        key={selectedBaggageTime?.id || 'new'}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedBaggageTime(null);
        }}
        onSubmit={selectedBaggageTime 
          ? (data) => handleUpdate(selectedBaggageTime.id, data) 
          : handleCreate
        }
        initialData={selectedBaggageTime}
        onSuccess={() => {
          fetchBaggageTimes();
          setIsFormOpen(false);
        }}
      />
    </div>
  );
} 