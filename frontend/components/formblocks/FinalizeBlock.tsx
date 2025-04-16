"use client";

import { Button } from "@/components/ui/button";

export default function FinalizeBlock() {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Afronden</h2>
      
      <div className="flex gap-2 justify-end">
        <Button variant="outline" type="button">
          Annuleren
        </Button>
        <Button variant="default" type="button">
          Print bon
        </Button>
      </div>
    </div>
  );
} 