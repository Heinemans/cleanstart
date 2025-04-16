import VacationAddressBlock from '@/components/formblocks/VacationAddressBlock';

export default function VacationAddressPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Vakantieadres Blok</h1>
      <div className="bg-gray-50 p-6 rounded-lg">
        <VacationAddressBlock />
      </div>
    </div>
  );
} 