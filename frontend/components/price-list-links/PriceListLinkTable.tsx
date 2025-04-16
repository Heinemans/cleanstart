import { PriceListLinkWithDetails } from '@/types/price-list-link';
import { Switch } from '@/components/ui/switch';
import { formatCurrency } from '@/lib/utils';

interface PriceListLinkTableProps {
  priceListLinks: PriceListLinkWithDetails[];
  onEdit: (priceListLink: PriceListLinkWithDetails) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number, active: boolean) => void;
  isLoading: boolean;
}

export function PriceListLinkTable({
  priceListLinks,
  onEdit,
  onDelete,
  onToggleActive,
  isLoading
}: PriceListLinkTableProps) {
  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (priceListLinks.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 text-center text-gray-500">
          No price list links found. Create your first one!
        </div>
      </div>
    );
  }

  const formatPriceListName = (priceListLink: PriceListLinkWithDetails) => {
    const validFrom = priceListLink.price_list_valid_from 
      ? new Date(priceListLink.price_list_valid_from).toLocaleDateString()
      : 'N/A';
    
    const validUntil = priceListLink.price_list_valid_until
      ? new Date(priceListLink.price_list_valid_until).toLocaleDateString()
      : 'N/A';
    
    return (
      <span>
        {priceListLink.price_list_name}
        <br />
        <span className="text-xs text-gray-500">
          {validFrom} - {validUntil}
        </span>
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price Code
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price List
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Daily Prices
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Day 15+
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Active
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {priceListLinks.map((priceListLink) => (
            <tr key={priceListLink.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{priceListLink.price_code_code}</div>
                <div className="text-sm text-gray-500">{priceListLink.price_code_name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatPriceListName(priceListLink)}
              </td>
              <td className="px-6 py-4">
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                  {priceListLink.daily_prices.map((price, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-500">Day {index + 1}:</span>
                      <span className="font-medium">{formatCurrency(price)}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-medium">
                {formatCurrency(priceListLink.price_extra_day)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Switch
                  checked={priceListLink.active}
                  onCheckedChange={(checked) => onToggleActive(priceListLink.id, checked)}
                  className="data-[state=checked]:bg-green-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(priceListLink)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this price list link?')) {
                      onDelete(priceListLink.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 