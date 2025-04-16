"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CommentsBlockProps = {
  externalValue?: string;
  internalValue?: string;
  onExternalChange?: (val: string) => void;
  onInternalChange?: (val: string) => void;
};

export default function CommentsBlock({
  externalValue = "",
  internalValue = "",
  onExternalChange,
  onInternalChange,
}: CommentsBlockProps) {
  const [activeTab, setActiveTab] = useState<"external" | "internal">("external");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const standardTexts = [
    { id: "1", text: "Bedankt voor uw reservering. Wij kijken ernaar uit u te verwelkomen." },
    { id: "2", text: "Uw fietsen worden op de aangegeven datum geleverd." },
    { id: "3", text: "Neem contact met ons op als u nog vragen heeft." },
  ];

  const handleExternalChange = (val: string) => {
    if (externalValue !== val && onExternalChange) {
      onExternalChange(val);
    }
  };

  const handleInternalChange = (val: string) => {
    if (internalValue !== val && onInternalChange) {
      onInternalChange(val);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = standardTexts.find(t => t.id === templateId);
    if (template) {
      if (activeTab === "external" && onExternalChange) {
        onExternalChange(template.text);
      } else if (activeTab === "internal" && onInternalChange) {
        onInternalChange(template.text);
      }
    }
  };

  return (
    <div className="p-6 rounded-xl space-y-4 border bg-white shadow-sm">
      <h2 className="text-lg font-semibold">Opmerkingen</h2>

      <div className="border-b border-gray-200 flex justify-between items-center">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab("external")}
            className={`whitespace-nowrap pb-3 pt-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "external"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Opmerking
          </button>
          <button
            onClick={() => setActiveTab("internal")}
            className={`whitespace-nowrap pb-3 pt-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "internal"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Interne opmerking
          </button>
        </nav>
        
        <div className="w-60">
          <Select 
            value={selectedTemplate} 
            onValueChange={handleTemplateChange}
          >
            <SelectTrigger id="standard-text" className="bg-white h-9 border border-gray-300">
              <SelectValue placeholder="--Standaard tekst--" className="text-gray-700" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300">
              {standardTexts.map(template => (
                <SelectItem key={template.id} value={template.id} className="bg-white hover:bg-gray-100">
                  {template.text.substring(0, 50)}{template.text.length > 50 ? "..." : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "external" ? (
          <Textarea
            value={externalValue}
            onChange={(e) => handleExternalChange(e.target.value)}
            placeholder="Voeg eventuele opmerkingen toe"
            rows={5}
            className="w-full bg-white"
          />
        ) : (
          <Textarea
            value={internalValue}
            onChange={(e) => handleInternalChange(e.target.value)}
            placeholder="Voeg interne opmerkingen toe (alleen zichtbaar voor medewerkers)"
            rows={5}
            className="w-full bg-white"
          />
        )}
      </div>
    </div>
  );
}
