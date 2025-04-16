import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { PriceListLink } from '@/types/price-list-link';
import { PriceCode } from '@/types/price-code';
import { PriceList } from '@/types/price-list';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

interface PriceListLinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<PriceListLink, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: PriceListLink | null;
  priceCodes: PriceCode[];
  priceLists: PriceList[];
  onSuccess?: () => void;
}

export function PriceListLinkForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  priceCodes, 
  priceLists, 
  onSuccess 
}: PriceListLinkFormProps) {
  // Initialize daily prices as an array of 14 zeros
  const emptyDailyPrices = Array(14).fill(0);
  
  const [formData, setFormData] = useState<Omit<PriceListLink, 'id' | 'created_at' | 'updated_at'>>({
    price_code_id: 0,
    price_list_id: 0,
    daily_prices: emptyDailyPrices,
    price_extra_day: 0,
    active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        price_code_id: initialData.price_code_id,
        price_list_id: initialData.price_list_id,
        daily_prices: initialData.daily_prices || emptyDailyPrices,
        price_extra_day: initialData.price_extra_day,
        active: initialData.active
      });
    } else {
      setFormData({
        price_code_id: priceCodes.length > 0 ? priceCodes[0].id : 0,
        price_list_id: priceLists.length > 0 ? priceLists[0].id : 0,
        daily_prices: emptyDailyPrices,
        price_extra_day: 0,
        active: true
      });
    }
    setErrors({});
  }, [initialData, priceCodes, priceLists]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.price_code_id) {
      newErrors.price_code_id = 'Price code is required';
    }

    if (!formData.price_list_id) {
      newErrors.price_list_id = 'Price list is required';
    }

    for (let i = 0; i < 14; i++) {
      if (formData.daily_prices[i] === undefined || formData.daily_prices[i] < 0) {
        newErrors[`daily_price_${i}`] = 'Valid price required';
      }
    }

    if (formData.price_extra_day === undefined || formData.price_extra_day < 0) {
      newErrors.price_extra_day = 'Valid price required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSubmit(formData);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  const handleDailyPriceChange = (index: number, value: string) => {
    const newPrice = parseFloat(value) || 0;
    const newDailyPrices = [...formData.daily_prices];
    newDailyPrices[index] = newPrice;
    setFormData({ ...formData, daily_prices: newDailyPrices });
  };

  const formatPriceListName = (priceList: PriceList) => {
    const validFrom = priceList.valid_from 
      ? new Date(priceList.valid_from).toLocaleDateString()
      : 'N/A';
    
    const validUntil = priceList.valid_until
      ? new Date(priceList.valid_until).toLocaleDateString()
      : 'N/A';
    
    return `${priceList.name} (${validFrom} - ${validUntil})`;
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {initialData ? 'Edit Price Link' : 'New Price Link'}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price_code_id">Price Code</Label>
                      <Select
                        value={formData.price_code_id.toString()}
                        onValueChange={(value) => 
                          setFormData({ ...formData, price_code_id: parseInt(value) })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a price code" />
                        </SelectTrigger>
                        <SelectContent>
                          {priceCodes.map((priceCode) => (
                            <SelectItem key={priceCode.id} value={priceCode.id.toString()}>
                              {priceCode.code} - {priceCode.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.price_code_id && (
                        <p className="text-sm text-red-500 mt-1">{errors.price_code_id}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="price_list_id">Price List</Label>
                      <Select
                        value={formData.price_list_id.toString()}
                        onValueChange={(value) => 
                          setFormData({ ...formData, price_list_id: parseInt(value) })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a price list" />
                        </SelectTrigger>
                        <SelectContent>
                          {priceLists.map((priceList) => (
                            <SelectItem key={priceList.id} value={priceList.id.toString()}>
                              {formatPriceListName(priceList)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.price_list_id && (
                        <p className="text-sm text-red-500 mt-1">{errors.price_list_id}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Daily Prices (Day 1-14)</Label>
                    <div className="grid grid-cols-7 gap-2 mt-2">
                      {Array.from({ length: 14 }).map((_, index) => (
                        <div key={index}>
                          <div className="flex items-center">
                            <span className="w-10 text-sm text-gray-500">Day {index + 1}</span>
                            <div className="flex-1">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.daily_prices[index] || 0}
                                onChange={(e) => handleDailyPriceChange(index, e.target.value)}
                                className={`w-full ${errors[`daily_price_${index}`] ? 'border-red-500' : ''}`}
                              />
                              {errors[`daily_price_${index}`] && (
                                <p className="text-xs text-red-500">{errors[`daily_price_${index}`]}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="price_extra_day">Price for Day 15+</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      id="price_extra_day"
                      value={formData.price_extra_day}
                      onChange={(e) => 
                        setFormData({ ...formData, price_extra_day: parseFloat(e.target.value) || 0 })
                      }
                      className={errors.price_extra_day ? 'border-red-500' : ''}
                    />
                    {errors.price_extra_day && (
                      <p className="text-sm text-red-500 mt-1">{errors.price_extra_day}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.active}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, active: checked })
                      }
                      id="active"
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      {initialData ? 'Update' : 'Create'}
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