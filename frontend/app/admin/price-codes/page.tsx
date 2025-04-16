'use client';

import { useState, useEffect } from 'react';
import { PriceCodeTable } from '@/components/price-codes/PriceCodeTable';
import { PriceCodeForm } from '@/components/price-codes/PriceCodeForm';
import {
  getPriceCodes,
  createPriceCode,
  updatePriceCode,
  deletePriceCode
} from '@/lib/api/price-codes';
import { PriceCode } from '@/types/price-code';
import { toast } from 'react-hot-toast';

export default function PriceCodesPage() {
  const [priceCodes, setPriceCodes] = useState<PriceCode[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPriceCode, setSelectedPriceCode] = useState<PriceCode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPriceCodes();
  }, []);

  const fetchPriceCodes = async () => {
    try {
      const data = await getPriceCodes();
      setPriceCodes(data);
    } catch (error) {
      toast.error('Failed to load price codes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: Omit<PriceCode, 'id'>) => {
    try {
      await createPriceCode(data);
      toast.success('Prijs code aangemaakt!');
      fetchPriceCodes();
      setIsFormOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Aanmaken mislukt');
    }
  };

  const handleUpdate = async (id: number, data: Partial<PriceCode>) => {
    try {
      await updatePriceCode(id, data);
      toast.success('Prijs code bijgewerkt!');
      fetchPriceCodes();
      setIsFormOpen(false);
      setSelectedPriceCode(null);
    } catch (error: any) {
      toast.error(error.message || 'Update mislukt');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this price code?')) {
      try {
        await deletePriceCode(id);
        toast.success('Price code deleted successfully');
        fetchPriceCodes();
      } catch (error) {
        toast.error('Failed to delete price code');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Price Codes</h1>
        <button
          onClick={() => {
            setSelectedPriceCode(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>+</span>
          <span>New Price Code</span>
        </button>
      </div>

      <PriceCodeTable
        priceCodes={priceCodes}
        onEdit={(priceCode) => {
          setSelectedPriceCode(priceCode);
          setIsFormOpen(true);
        }}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <PriceCodeForm
        key={selectedPriceCode?.id || 'new'}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedPriceCode(null);
        }}
        onSubmit={selectedPriceCode ? (data) => handleUpdate(selectedPriceCode.id, data) : handleCreate}
        initialData={selectedPriceCode}
        onSuccess={() => {
          fetchPriceCodes();
          setIsFormOpen(false);
        }}
      />
    </div>
  );
} 