import CustomerDetailsBlock from '@/components/formblocks/CustomerDetailsBlock';

export default function CustomerDetailsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Klantgegevens Blok</h1>
      <div className="bg-gray-50 p-6 rounded-lg">
        <CustomerDetailsBlock />
      </div>
    </div>
  );
} 