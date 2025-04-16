"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Customer = {
  lastname: string;
  firstname?: string;
  phone?: string;
  email?: string;
  street?: string;
  housenumber?: string;
  postalcode?: string;
  city?: string;
  country?: string;
};

type CustomerDetailsBlockProps = {
  value: Customer;
  onChange: (val: Customer) => void;
};

export default function CustomerDetailsBlock({
  value,
  onChange,
}: CustomerDetailsBlockProps) {
  const [showExtra, setShowExtra] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateCustomer(value: Customer) {
    const errors: Record<string, string> = {};

    if (!value.lastname || value.lastname.trim() === "") {
      errors.lastname = "Achternaam is verplicht";
    }

    if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
      errors.email = "Geen geldig e-mailadres";
    }

    if (value.phone && !/^[0-9\-+() ]{6,}$/.test(value.phone)) {
      errors.phone = "Geen geldig telefoonnummer";
    }

    if (value.postalcode && !/^[1-9][0-9]{3}\s?[A-Za-z]{2}$/.test(value.postalcode)) {
      errors.postalcode = "Geen geldige postcode (bijv. 1234 AB)";
    }

    return errors;
  }

  const validateField = (field: keyof Customer) => {
    const fieldErrors = validateCustomer(value);
    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors[field] || ""
    }));
  };

  const handleFieldChange = (field: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (value[field] !== newValue) {
      const newCustomer = { ...value, [field]: newValue };
      onChange(newCustomer);
      
      // Clear error when typing
      if (errors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: ""
        }));
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the form from causing a page refresh
    
    // Validate all fields on form submission
    const newErrors = validateCustomer(value);
    setErrors(newErrors);
  };

  return (
    <div className="p-6 rounded-xl space-y-4 border bg-white shadow-sm">
      <h2 className="text-lg font-semibold">Klantgegevens</h2>

      <form onSubmit={handleSubmit}>
        {/* Achternaam (verplicht) */}
        <div className="grid gap-2">
          <Label htmlFor="lastname">Achternaam</Label>
          <Input
            id="lastname"
            value={value.lastname}
            onChange={handleFieldChange("lastname")}
            onBlur={() => validateField("lastname")}
            placeholder="Verplicht veld"
            className={errors.lastname ? "border-red-500" : ""}
          />
          {errors.lastname && (
            <p className="text-xs text-red-500 mt-1">{errors.lastname}</p>
          )}
        </div>

        {/* Toggle: Extra velden tonen */}
        <div className="flex items-center gap-2 mt-4">
          <Switch
            checked={showExtra}
            onCheckedChange={setShowExtra}
            id="toggleExtra"
          />
          <Label htmlFor="toggleExtra">Toon extra velden</Label>
        </div>

        {showExtra && (
          <div className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="firstname">Voornaam</Label>
                <Input
                  id="firstname"
                  value={value.firstname || ""}
                  onChange={handleFieldChange("firstname")}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Telefoonnummer</Label>
                <Input
                  id="phone"
                  value={value.phone || ""}
                  onChange={handleFieldChange("phone")}
                  onBlur={() => validateField("phone")}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                value={value.email || ""}
                onChange={handleFieldChange("email")}
                onBlur={() => validateField("email")}
                type="email"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="street">Straat</Label>
                <Input
                  id="street"
                  value={value.street || ""}
                  onChange={handleFieldChange("street")}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="housenumber">Huisnummer</Label>
                <Input
                  id="housenumber"
                  value={value.housenumber || ""}
                  onChange={handleFieldChange("housenumber")}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="postalcode">Postcode</Label>
                <Input
                  id="postalcode"
                  value={value.postalcode || ""}
                  onChange={handleFieldChange("postalcode")}
                  onBlur={() => validateField("postalcode")}
                  className={errors.postalcode ? "border-red-500" : ""}
                />
                {errors.postalcode && (
                  <p className="text-xs text-red-500 mt-1">{errors.postalcode}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="city">Woonplaats</Label>
                <Input
                  id="city"
                  value={value.city || ""}
                  onChange={handleFieldChange("city")}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="country">Land</Label>
              <Input
                id="country"
                value={value.country || "Nederland"}
                onChange={handleFieldChange("country")}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
} 