"use client";

import { useState, useMemo } from "react";
import CustomerDetailsBlock from "@/components/formblocks/CustomerDetailsBlock";
import VacationAddressBlock from "@/components/formblocks/VacationAddressBlock";
import ExtraServicesBlock from "@/components/formblocks/ExtraServicesBlock";
import RentalPeriodBlock from "@/components/formblocks/RentalPeriodBlock";
import RentalItemsBlock from "@/components/formblocks/RentalItemsBlock";
import CommentsBlock from "@/components/formblocks/CommentsBlock";
import PriceInformationBlock from "@/components/formblocks/PriceInformationBlock";
import PaymentMethodBlock from "@/components/formblocks/PaymentMethodBlock";
import FinalizeBlock from "@/components/formblocks/FinalizeBlock";
import { z } from "zod";

// Define the schema to match CustomerDetailsBlock's expected structure
const customerSchema = z.object({
  lastname: z.string(),
  firstname: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  street: z.string().optional(),
  housenumber: z.string().optional(),
  postalcode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

// Define the schema for VacationAddressBlock
const vacationAddressSchema = z.object({
  accommodation_type_id: z.string().optional(),
  vacation_address: z.string().optional(),
});

// Define the schema for ExtraServicesBlock
const extraServicesSchema = z.object({
  baggage_transport: z.boolean().default(false),
  baggage_pickup: z.boolean().default(false),
  baggage_delivery: z.boolean().default(false),
  transport_outbound: z.boolean().default(false),
  transport_return: z.boolean().default(false),
  transport_outbound_date: z.string().optional(),
  transport_outbound_time: z.string().optional(),
  transport_outbound_boat_time: z.string().optional(),
  labelCountHeen: z.number().optional(),
  transport_return_date: z.string().optional(),
  transport_return_time: z.string().optional(),
  transport_return_boat_time: z.string().optional(),
  labelCountTerug: z.number().optional(),
  boatTimeOut: z.string().optional(),
  boatTimeReturn: z.string().optional(),
});

// Define the schema for our form data's rental period
const rentalPeriodSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  numberOfDays: z.number().default(1),
});

// Define the schema for rental items (for formData)
const rentalItemSchema = z.object({
  item_number: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  price: z.number(),
  discount: z.number(),
  total: z.number(),
});

// Define the schema for comments
const commentsSchema = z.object({
  external: z.string().optional(),
  internal: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;
type VacationAddressFormValues = z.infer<typeof vacationAddressSchema>;
type ExtraServicesFormValues = z.infer<typeof extraServicesSchema>;
type RentalPeriodFormValues = z.infer<typeof rentalPeriodSchema>;
type RentalItemValues = z.infer<typeof rentalItemSchema>;
type CommentsValues = z.infer<typeof commentsSchema>;

// Define the type for the RentalPeriodBlock component's values
type RentalPeriodBlockValues = {
  start_date?: Date;
  end_date?: Date;
  days: number;
};

// Define the structure used by the RentalItemsBlock component
interface RentalItemComponentType {
  id: string;
  item_number: string;
  start_date: Date;
  end_date: Date;
  price: number;
  discount: string;
  total: number;
}

export default function RentalFormPage() {
  const [formData, setFormData] = useState({
    customer: {
      lastname: "",
      firstname: "",
      phone: "",
      email: "",
      street: "",
      housenumber: "",
      postalcode: "",
      city: "",
      country: "Nederland",
    } as CustomerFormValues,
    vacationAddress: {
      accommodation_type_id: "",
      vacation_address: "",
    } as VacationAddressFormValues,
    extraServices: {
      baggage_transport: false,
      baggage_pickup: false,
      baggage_delivery: false,
      transport_outbound: false,
      transport_return: false,
      transport_outbound_date: "",
      transport_outbound_time: "",
      transport_outbound_boat_time: "",
      labelCountHeen: 0,
      transport_return_date: "",
      transport_return_time: "",
      transport_return_boat_time: "",
      labelCountTerug: 0,
      boatTimeOut: "",
      boatTimeReturn: "",
    } as ExtraServicesFormValues,
    rentalPeriod: {
      startDate: new Date(),
      endDate: new Date(),
      numberOfDays: 1,
    } as RentalPeriodFormValues,
    rentalItems: [] as RentalItemValues[],
    comments: {
      external: "",
      internal: "",
    } as CommentsValues,
    paymentMethod: "pin", // Default to PIN payment
  });

  // For debugging
  console.log("Rendering RentalFormPage with data:", formData);

  // Map the formData.rentalPeriod to the format expected by RentalPeriodBlock
  const mapToRentalPeriodBlockValues = (): RentalPeriodBlockValues => {
    return {
      start_date: formData.rentalPeriod.startDate,
      end_date: formData.rentalPeriod.endDate,
      days: formData.rentalPeriod.numberOfDays,
    };
  };

  // Map the RentalPeriodBlock values back to our formData structure
  const handleRentalPeriodChange = (data: RentalPeriodBlockValues) => {
    setFormData((prev) => ({
      ...prev,
      rentalPeriod: {
        startDate: data.start_date,
        endDate: data.end_date,
        numberOfDays: data.days,
      },
    }));
  };

  // Helper function to check deep equality
  const isEqual = (a: any, b: any): boolean => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  // Memoize the rental items to prevent unnecessary re-renders
  const rentalItemsValue = useMemo(() => {
    return formData.rentalItems.map((item, index) => ({
      id: index.toString(), // Generate an ID for the component
      item_number: item.item_number,
      start_date: new Date(item.startDate || new Date()),
      end_date: new Date(item.endDate || new Date()),
      price: item.price,
      discount: `${item.discount}%`, // Convert number to string percentage
      total: item.total,
    }));
  }, [formData.rentalItems]);

  // Adapter function to convert RentalItemsBlock values back to our formData structure
  const handleRentalItemsChange = (items: RentalItemComponentType[]) => {
    const mappedItems = items.map(item => ({
      item_number: item.item_number,
      startDate: item.start_date.toISOString().split('T')[0], // Convert Date to string (YYYY-MM-DD)
      endDate: item.end_date.toISOString().split('T')[0], // Convert Date to string (YYYY-MM-DD)
      price: item.price,
      discount: parseFloat(item.discount) || 0, // Convert string percentage to number
      total: item.total,
    }));
    
    // Only update state if the items have actually changed
    setFormData(prev => {
      // Check if the new mappedItems are different from the current rentalItems
      if (isEqual(prev.rentalItems, mappedItems)) {
        return prev; // No change, return previous state
      }
      return { ...prev, rentalItems: mappedItems };
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form column - takes up 2/3 of the space on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <CustomerDetailsBlock
            value={formData.customer}
            onChange={(data) =>
              setFormData((prev) => ({ ...prev, customer: data }))
            }
          />
          
          <VacationAddressBlock
            value={formData.vacationAddress}
            onChange={(data) =>
              setFormData((prev) => ({ ...prev, vacationAddress: data }))
            }
          />

          <ExtraServicesBlock
            value={formData.extraServices}
            onChange={(data) => {
              console.log("ExtraServices changed:", data);
              setFormData((prev) => ({ ...prev, extraServices: data }));
            }}
          />

          <RentalPeriodBlock
            value={mapToRentalPeriodBlockValues()}
            onChange={handleRentalPeriodChange}
          />

          <RentalItemsBlock
            value={rentalItemsValue}
            onChange={handleRentalItemsChange}
          />

          <CommentsBlock
            externalValue={formData.comments.external}
            internalValue={formData.comments.internal}
            onExternalChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                comments: { ...prev.comments, external: val },
              }))
            }
            onInternalChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                comments: { ...prev.comments, internal: val },
              }))
            }
          />
        </div>
        
        {/* Right column for price information - takes up 1/3 of the space on large screens */}
        <div className="space-y-6">
          <PriceInformationBlock
            rentalItems={formData.rentalItems}
            extraServices={formData.extraServices}
            rentalPeriod={formData.rentalPeriod}
          />
          
          <PaymentMethodBlock
            value={formData.paymentMethod}
            onChange={(method) =>
              setFormData((prev) => ({ ...prev, paymentMethod: method }))
            }
          />
          
          <FinalizeBlock />
        </div>
      </div>
    </div>
  );
} 