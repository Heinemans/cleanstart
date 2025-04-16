import RentalPeriodBlock from '@/components/formblocks/RentalPeriodBlock';

export default function RentalPeriodPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Verhuurperiode Blok</h1>
      <div className="bg-gray-50 p-6 rounded-lg">
        <RentalPeriodBlock />
      </div>
    </div>
  );
} 