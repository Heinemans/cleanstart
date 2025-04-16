"use client";

import { useState, useEffect, useRef } from "react";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Function to calculate difference in days (inclusive of start and end dates)
function calculateDaysDifference(startDate: Date | null, endDate: Date | null): number {
  if (!startDate || !endDate) return 0;
  
  // Reset time to ensure accurate day calculation
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  // Calculate difference in milliseconds and convert to days
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Add 1 to include both start and end dates
  return diffDays + 1;
}

// Function to calculate end date based on start date and number of days
function calculateEndDate(startDate: Date, numberOfDays: number): Date {
  const endDate = new Date(startDate);
  // Subtract 1 because the start date is included in the count
  endDate.setDate(endDate.getDate() + numberOfDays - 1);
  return endDate;
}

// Create the schema
const formSchema = z.object({
  start_date: z.date({
    required_error: "Startdatum is verplicht",
  }),
  end_date: z.date({
    required_error: "Einddatum is verplicht",
  }),
  days: z.coerce.number().min(1, "Minimaal 1 dag"),
});

type RentalPeriodFormValues = z.infer<typeof formSchema>;

interface RentalPeriodBlockProps {
  value?: Partial<RentalPeriodFormValues>;
  onChange?: (data: RentalPeriodFormValues) => void;
}

export default function RentalPeriodBlock({ value = {}, onChange }: RentalPeriodBlockProps) {
  // State for validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Tracking when we're programmatically updating values
  const isUpdatingRef = useRef(false);
  
  // Get today's date for initial values
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Convert date strings to Date objects if needed
  const initialValues = {
    start_date: value?.start_date instanceof Date ? value.start_date : today,
    end_date: value?.end_date instanceof Date ? value.end_date : today,
    days: value?.days || 1,
  };
  
  const form = useForm<RentalPeriodFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // Validation function for rental period
  function validateRentalPeriod(value: RentalPeriodFormValues) {
    const errors: Record<string, string> = {};

    if (!value.start_date) {
      errors.start_date = "Startdatum is verplicht";
    }

    if (!value.end_date) {
      errors.end_date = "Einddatum is verplicht";
    }

    if (value.start_date && value.end_date) {
      const start = new Date(value.start_date);
      const end = new Date(value.end_date);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      if (end < start) {
        errors.end_date = "Einddatum moet na startdatum liggen";
      }
    }

    if (!value.days || value.days < 1) {
      errors.days = "Aantal dagen moet minimaal 1 zijn";
    }

    return errors;
  }

  // Validate a specific field
  const validateField = (field: keyof RentalPeriodFormValues) => {
    const fieldValue = form.getValues();
    const fieldErrors = validateRentalPeriod(fieldValue);
    
    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors[field] || ""
    }));
  };

  // Clear error for a specific field
  const clearFieldError = (field: keyof RentalPeriodFormValues) => {
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Setup one-time parent notification when form changes
  useEffect(() => {
    // Only used to notify parent of changes, not for internal calculations
    const subscription = form.watch((data) => {
      if (!isUpdatingRef.current && onChange) {
        onChange(data as RentalPeriodFormValues);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  // Handle start date change
  const handleStartDateChange = (date: Date | null) => {
    if (!date) return;
    
    // Clear error for this field
    clearFieldError("start_date");
    
    isUpdatingRef.current = true;
    try {
      // Update start date in form
      form.setValue("start_date", date);
      
      // Get current end date and days
      const endDate = form.getValues("end_date");
      const days = form.getValues("days");
      
      if (endDate) {
        // If end date exists, recalculate days
        if (endDate < date) {
          // If end date is before start date, adjust end date
          const newEndDate = new Date(date);
          form.setValue("end_date", newEndDate);
          form.setValue("days", 1);
        } else {
          // Recalculate days based on the new date range
          const newDays = calculateDaysDifference(date, endDate);
          form.setValue("days", newDays);
        }
      } else {
        // If no end date, calculate it from days
        const newEndDate = calculateEndDate(date, days);
        form.setValue("end_date", newEndDate);
      }
    } finally {
      isUpdatingRef.current = false;
    }
  };

  // Handle end date change
  const handleEndDateChange = (date: Date | null) => {
    if (!date) return;
    
    // Clear error for this field
    clearFieldError("end_date");
    
    isUpdatingRef.current = true;
    try {
      // Update end date in form
      form.setValue("end_date", date);
      
      // Get current start date
      const startDate = form.getValues("start_date");
      
      if (startDate) {
        if (date < startDate) {
          // Show validation error
          form.setError("end_date", {
            type: "manual",
            message: "Einddatum moet na startdatum liggen",
          });
          
          // Set local error state
          setErrors(prev => ({
            ...prev,
            end_date: "Einddatum moet na startdatum liggen"
          }));
        } else {
          // Clear any existing errors
          form.clearErrors("end_date");
          clearFieldError("end_date");
          
          // Recalculate days based on the new date range
          const newDays = calculateDaysDifference(startDate, date);
          form.setValue("days", newDays);
        }
      }
    } finally {
      isUpdatingRef.current = false;
    }
  };

  // Handle days change
  const handleDaysChange = (days: number) => {
    if (days < 1) days = 1;
    
    // Clear error for this field
    clearFieldError("days");
    
    isUpdatingRef.current = true;
    try {
      // Update days in form
      form.setValue("days", days);
      
      // Get current start date
      const startDate = form.getValues("start_date");
      
      if (startDate) {
        // Calculate new end date based on start date and days
        const newEndDate = calculateEndDate(startDate, days);
        form.setValue("end_date", newEndDate);
        
        // Clear any end date errors since we're setting it programmatically
        form.clearErrors("end_date");
        clearFieldError("end_date");
      }
    } finally {
      isUpdatingRef.current = false;
    }
  };

  // Update form when value prop changes
  useEffect(() => {
    if (!value) return;
    
    isUpdatingRef.current = true;
    try {
      // Handle start_date changes from props first
      if (value.start_date !== undefined) {
        form.setValue("start_date", value.start_date);
      }
      
      // Handle end_date changes from props
      if (value.end_date !== undefined) {
        form.setValue("end_date", value.end_date);
      }
      
      // Handle days changes from props
      if (value.days !== undefined) {
        form.setValue("days", value.days);
      }
      
      // Recalculate derived values if needed
      const formValues = form.getValues();
      
      // If we have start date and days but no end date, calculate end date
      if (formValues.start_date && formValues.days && !value.end_date) {
        const newEndDate = calculateEndDate(formValues.start_date, formValues.days);
        form.setValue("end_date", newEndDate);
      }
      
      // If we have start date and end date but no days, calculate days
      if (formValues.start_date && formValues.end_date && !value.days) {
        const newDays = calculateDaysDifference(formValues.start_date, formValues.end_date);
        form.setValue("days", newDays);
      }
    } finally {
      isUpdatingRef.current = false;
    }
  }, [value, form]);

  return (
    <div className="space-y-4 rounded-md border p-4 shadow-sm bg-white">
      <h2 className="text-lg font-semibold">Verhuurperiode</h2>

      <Form {...form}>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Startdatum</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      value={field.value ? (field.value as Date).toISOString().split('T')[0] : ''} 
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : null;
                        handleStartDateChange(date);
                      }}
                      onBlur={() => validateField("start_date")}
                      className={errors.start_date ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                  {errors.start_date && (
                    <p className="text-xs text-red-500 mt-1">{errors.start_date}</p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Einddatum</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      value={field.value ? (field.value as Date).toISOString().split('T')[0] : ''} 
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : null;
                        handleEndDateChange(date);
                      }}
                      onBlur={() => validateField("end_date")}
                      className={errors.end_date ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                  {errors.end_date && (
                    <p className="text-xs text-red-500 mt-1">{errors.end_date}</p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aantal dagen</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="1"
                      value={field.value}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        handleDaysChange(value || 1);
                      }}
                      onBlur={() => validateField("days")}
                      className={errors.days ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                  {errors.days && (
                    <p className="text-xs text-red-500 mt-1">{errors.days}</p>
                  )}
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
} 