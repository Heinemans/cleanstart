"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Banknote, Receipt, Split } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  payment_method: z.enum(["pin", "contant", "rekening", "split"], {
    required_error: "Kies een betaalmethode",
  }),
});

type PaymentFormValues = z.infer<typeof formSchema>;

interface PaymentMethodBlockProps {
  value?: string;
  onChange?: (method: string) => void;
}

// Validation function for payment method
const validatePaymentMethod = (value?: string): string | undefined => {
  if (!value || !["pin", "contant", "rekening", "split"].includes(value)) {
    return "Kies een betaalmethode";
  }
  return undefined;
};

export default function PaymentMethodBlock({ value = "pin", onChange }: PaymentMethodBlockProps) {
  const [error, setError] = useState<string | undefined>(undefined);
  const [validated, setValidated] = useState(false);
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment_method: value as "pin" | "contant" | "rekening" | "split",
    },
  });

  // Watch for form changes and notify parent
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (data.payment_method) {
        onChange?.(data.payment_method);
        // Clear error when value changes
        if (error) {
          setError(undefined);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange, error]);

  // Update form when value prop changes
  useEffect(() => {
    if (value && form.getValues().payment_method !== value) {
      form.setValue("payment_method", value as "pin" | "contant" | "rekening" | "split");
    }
  }, [value, form]);

  // Handle blur event to trigger validation
  const handleBlur = () => {
    const currentValue = form.getValues().payment_method;
    const validationError = validatePaymentMethod(currentValue);
    setError(validationError);
    setValidated(true);
  };

  return (
    <div className="space-y-4 rounded-md border p-4 shadow-sm bg-white">
      <h2 className="text-lg font-semibold">Betaalmethode</h2>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div onBlur={handleBlur}>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Clear error when value changes
                        setError(undefined);
                      }}
                      defaultValue={field.value}
                      className={cn(
                        "grid grid-cols-1 md:grid-cols-2 gap-4",
                        validated && error ? "border border-red-500 p-2 rounded-md" : ""
                      )}
                    >
                      <RadioGroupItem
                        value="pin"
                        id="pin"
                        label="PIN-betaling"
                        icon={<CreditCard className="h-4 w-4" />}
                      />
                      <RadioGroupItem
                        value="contant"
                        id="contant"
                        label="Contant"
                        icon={<Banknote className="h-4 w-4" />}
                      />
                      <RadioGroupItem
                        value="rekening"
                        id="rekening"
                        label="Op rekening"
                        icon={<Receipt className="h-4 w-4" />}
                      />
                      <RadioGroupItem
                        value="split"
                        id="split"
                        label="Splitbetaling"
                        icon={<Split className="h-4 w-4" />}
                      />
                    </RadioGroup>
                  </div>
                </FormControl>
                {error && validated && (
                  <p className="text-sm font-medium text-red-500 mt-2">{error}</p>
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