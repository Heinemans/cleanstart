"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAccommodationTypes } from "@/lib/api/accommodation-types";
import type { AccommodationType } from "@/types/accommodation-type";

const formSchema = z.object({
  accommodation_type_id: z.string().optional(),
  vacation_address: z.string().optional(),
});

type VacationAddressFormValues = z.infer<typeof formSchema>;

interface VacationAddressBlockProps {
  value?: Partial<VacationAddressFormValues>;
  onChange?: (data: VacationAddressFormValues) => void;
}

export default function VacationAddressBlock({ value = {}, onChange }: VacationAddressBlockProps) {
  const [accommodationTypes, setAccommodationTypes] = useState<AccommodationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const form = useForm<VacationAddressFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...{
        accommodation_type_id: "",
        vacation_address: "",
      },
      ...value
    },
  });

  function validateVacationAddress(value: Partial<VacationAddressFormValues>) {
    const errors: Record<string, string> = {};

    if (!value.vacation_address || value.vacation_address.trim() === "") {
      errors.vacation_address = "Vakantieadres is verplicht";
    }

    return errors;
  }

  const validateField = (fieldName: string) => {
    const fieldValue = form.getValues();
    const fieldErrors = validateVacationAddress(fieldValue);
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors[fieldName] || ""
    }));
  };

  // Fetch accommodation types
  useEffect(() => {
    const fetchAccommodationTypes = async () => {
      try {
        const types = await getAccommodationTypes();
        setAccommodationTypes(types);
      } catch (error) {
        console.error("Failed to fetch accommodation types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodationTypes();
  }, []);

  // Watch for form changes and notify parent
  useEffect(() => {
    const subscription = form.watch((data) => {
      const currentValues = form.getValues();
      const hasChanged = JSON.stringify(currentValues) !== JSON.stringify(value);
      
      if (hasChanged && onChange) {
        onChange(data as VacationAddressFormValues);
        
        // Clear error when the vacation_address field changes
        if (errors.vacation_address && data.vacation_address !== value.vacation_address) {
          setErrors(prev => ({
            ...prev,
            vacation_address: ""
          }));
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange, value, errors]);

  // Update form when value prop changes
  useEffect(() => {
    if (value) {
      const currentValues = form.getValues();
      
      // Only update if the values are actually different
      const hasChanged = Object.entries(value).some(
        ([key, val]) => val !== undefined && val !== currentValues[key as keyof VacationAddressFormValues]
      );
      
      if (hasChanged) {
        Object.entries(value).forEach(([key, val]) => {
          if (val !== undefined) {
            form.setValue(key as any, val, { shouldDirty: false, shouldTouch: false });
          }
        });
      }
    }
  }, [value, form]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the form from causing a page refresh
    
    // Validate all fields on form submission
    const allErrors = validateVacationAddress(form.getValues());
    setErrors(allErrors);
  };

  return (
    <div className="space-y-4 rounded-md border p-4 shadow-sm bg-white">
      <h2 className="text-lg font-semibold">Vakantieadres</h2>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="accommodation_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accommodatietype</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Kies accommodatietype" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    {accommodationTypes.map(type => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vacation_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vakantieadres</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Bijvoorbeeld: Jan de Grootweg 12, Hollum" 
                    className={errors.vacation_address ? "border-red-500" : ""}
                    onBlur={() => validateField("vacation_address")}
                  />
                </FormControl>
                {errors.vacation_address && (
                  <p className="text-xs text-red-500 mt-1">{errors.vacation_address}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
} 