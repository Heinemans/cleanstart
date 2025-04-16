'use client';

import { useState, useEffect } from 'react';
import { PriceListTable } from '@/components/price-lists/PriceListTable';
import { PriceListForm } from '@/components/price-lists/PriceListForm';
import { priceListApi } from '@/lib/api/price-lists';
import { PriceList } from '@/types/price-list';
import { toast } from 'react-hot-toast';

export default function PriceListsPage() {
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPriceList, setSelectedPriceList] = useState<PriceList | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPriceLists();
  }, []);

  const fetchPriceLists = async () => {
    try {
      const data = await priceListApi.getAll();
      setPriceLists(data);
    } catch (error) {
      toast.error('Failed to load price lists');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: Omit<PriceList, 'id'>) => {
    try {
      await priceListApi.create(data);
      toast.success('Price list created successfully');
      fetchPriceLists();
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Failed to create price list');
    }
  };

  const handleUpdate = async (id: number, data: Partial<PriceList>) => {
    try {
      await priceListApi.update(id, data);
      toast.success('Price list updated successfully');
      fetchPriceLists();
      setIsFormOpen(false);
      setSelectedPriceList(null);
    } catch (error) {
      toast.error('Failed to update price list');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this price list?')) {
      try {
        await priceListApi.delete(id);
        toast.success('Price list deleted successfully');
        fetchPriceLists();
      } catch (error) {
        toast.error('Failed to delete price list');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Price Lists</h1>
        <button
          onClick={() => {
            setSelectedPriceList(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>+</span>
          <span>New Price List</span>
        </button>
      </div>

      <PriceListTable
        priceLists={priceLists}
        onEdit={(priceList) => {
          setSelectedPriceList(priceList);
          setIsFormOpen(true);
        }}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <PriceListForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedPriceList(null);
        }}
        onSubmit={selectedPriceList ? (data) => handleUpdate(selectedPriceList.id, data) : handleCreate}
        initialData={selectedPriceList}
      />
    </div>
  );
} 