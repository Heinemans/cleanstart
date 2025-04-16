import PriceInformationBlock from "@/components/formblocks/PriceInformationBlock";

export default function PriceInformationPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Prijsinformatie Block</h1>
      <p className="mb-6 text-muted-foreground">
        Dit blok toont een overzicht van huurbedragen, services, BTW en totaalbedrag voor de verhuur.
      </p>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <PriceInformationBlock />
      </div>
    </div>
  );
} 