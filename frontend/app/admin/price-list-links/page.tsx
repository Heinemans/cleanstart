'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PriceListLinkTable } from '@/components/price-list-links/PriceListLinkTable';
import { PriceListLinkForm } from '@/components/price-list-links/PriceListLinkForm';
import { 
  getPriceListLinks, 
  createPriceListLink, 
  updatePriceListLink, 
  deletePriceListLink 
} from '@/lib/api/price-list-links';
import { getPriceCodes } from '@/lib/api/price-codes';
import { getPriceLists } from '@/lib/api/price-lists';
import { PriceListLinkWithDetails } from '@/types/price-list-link';
import { PriceCode } from '@/types/price-code';
import { PriceList } from '@/types/price-list';

export default function PriceListLinksPage() {
  const [priceListLinks, setPriceListLinks] = useState<PriceListLinkWithDetails[]>([]);
  const [priceCodes, setPriceCodes] = useState<PriceCode[]>([]);
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPriceListLink, setSelectedPriceListLink] = useState<PriceListLinkWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPriceListId, setSelectedPriceListId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Set the initial selected price list to the active one or first in the list
  useEffect(() => {
    if (priceLists.length > 0 && selectedPriceListId === null) {
      // Try to find an active price list
      const activePriceList = priceLists.find(list => list.active === true);
      // Set to active list or first in the list as fallback
      setSelectedPriceListId(activePriceList?.id || priceLists[0].id);
    }
  }, [priceLists, selectedPriceListId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [linksData, priceCodesData, priceListsData] = await Promise.all([
        getPriceListLinks(),
        getPriceCodes(),
        getPriceLists()
      ]);
      
      setPriceListLinks(linksData);
      setPriceCodes(priceCodesData);
      setPriceLists(priceListsData);
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: Omit<PriceListLinkWithDetails, 'id' | 'created_at' | 'updated_at' | 'price_code_name' | 'price_code_code' | 'price_list_name' | 'price_list_valid_from' | 'price_list_valid_until'>) => {
    try {
      await createPriceListLink(data);
      toast.success('Price list link created successfully');
      fetchData();
      setIsFormOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create price list link');
    }
  };

  const handleUpdate = async (id: number, data: Partial<Omit<PriceListLinkWithDetails, 'id' | 'created_at' | 'updated_at' | 'price_code_name' | 'price_code_code' | 'price_list_name' | 'price_list_valid_from' | 'price_list_valid_until'>>) => {
    try {
      await updatePriceListLink(id, data);
      toast.success('Price list link updated successfully');
      fetchData();
      setIsFormOpen(false);
      setSelectedPriceListLink(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update price list link');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePriceListLink(id);
      toast.success('Price list link deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete price list link');
    }
  };

  const handleToggleActive = async (id: number, active: boolean) => {
    try {
      await updatePriceListLink(id, { active });
      toast.success(`Price list link ${active ? 'activated' : 'deactivated'} successfully`);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update price list link status');
    }
  };

  // Filter price list links based on selected price list
  const filteredLinks = selectedPriceListId
    ? priceListLinks.filter(link => link.price_list_id === selectedPriceListId)
    : priceListLinks;

  // Format the price list name with dates for dropdown
  const formatPriceListOption = (priceList: PriceList) => {
    const validFrom = priceList.valid_from 
      ? new Date(priceList.valid_from).toLocaleDateString()
      : '';
    
    const validUntil = priceList.valid_until
      ? new Date(priceList.valid_until).toLocaleDateString()
      : '';
    
    const dateRange = validFrom && validUntil ? ` (${validFrom} t/m ${validUntil})` : '';
    return `${priceList.name}${dateRange}`;
  };

  // Check if we have filtered links or not
  const hasFilteredLinks = filteredLinks.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Price List Links</h1>
        <button
          onClick={() => {
            setSelectedPriceListLink(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          disabled={priceCodes.length === 0 || priceLists.length === 0}
        >
          <span>+</span>
          <span>New Price Link</span>
        </button>
      </div>

      {(priceCodes.length === 0 || priceLists.length === 0) && !isLoading && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p className="font-bold">Warning</p>
          <p>
            {priceCodes.length === 0 ? 'You need to create price codes before creating price list links. ' : ''}
            {priceLists.length === 0 ? 'You need to create price lists before creating price list links.' : ''}
          </p>
        </div>
      )}

      {/* Price List Filter Dropdown */}
      <div className="mb-6">
        <label htmlFor="priceListFilter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Price List
        </label>
        <select
          id="priceListFilter"
          value={selectedPriceListId || ''}
          onChange={(e) => setSelectedPriceListId(e.target.value ? Number(e.target.value) : null)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">All Price Lists</option>
          {priceLists.map((priceList) => (
            <option key={priceList.id} value={priceList.id}>
              {formatPriceListOption(priceList)}
              {priceList.active ? ' (Active)' : ''}
            </option>
          ))}
        </select>
      </div>

      {(!selectedPriceListId || !hasFilteredLinks) && !isLoading && (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
          <p>Selecteer een prijslijst om gekoppelde prijzen te bekijken.</p>
        </div>
      )}

      {hasFilteredLinks && !isLoading && (
        <PriceListLinkTable
          priceListLinks={filteredLinks}
          onEdit={(priceListLink) => {
            setSelectedPriceListLink(priceListLink);
            setIsFormOpen(true);
          }}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          isLoading={isLoading}
        />
      )}

      {isLoading && (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      <PriceListLinkForm
        key={selectedPriceListLink?.id || 'new'}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedPriceListLink(null);
        }}
        onSubmit={selectedPriceListLink 
          ? (data) => handleUpdate(selectedPriceListLink.id, data) 
          : handleCreate
        }
        initialData={selectedPriceListLink}
        priceCodes={priceCodes}
        priceLists={priceLists}
        onSuccess={() => {
          fetchData();
          setIsFormOpen(false);
        }}
      />
    </div>
  );
} 