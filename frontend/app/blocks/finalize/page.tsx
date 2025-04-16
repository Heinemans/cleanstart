"use client";

import FinalizeBlock from "@/components/formblocks/FinalizeBlock";
import { useRouter } from "next/navigation";

export default function FinalizePage() {
  const router = useRouter();
  
  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Finaliseren</h1>
      <p className="text-gray-600">
        Dit is een voorbeeld van het Finaliseren-blok voor in het verhuurformulier.
      </p>
      
      <div className="mt-8 max-w-xl mx-auto">
        <FinalizeBlock onCancel={handleCancel} />
      </div>
    </div>
  );
} 