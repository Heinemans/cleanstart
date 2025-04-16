import React, { useState } from 'react';

// Import all required block components
import CustomerDetailsBlock from '@/components/formblocks/CustomerDetailsBlock';
import VacationAddressBlock from '@/components/formblocks/VacationAddressBlock';
import ExtraServicesBlock from '@/components/formblocks/ExtraServicesBlock';
import RentalPeriodBlock from '@/components/formblocks/RentalPeriodBlock';
import RentalItemsBlock from '@/components/formblocks/RentalItemsBlock';
import CommentsBlock from '@/components/formblocks/CommentsBlock';
import PriceInformationBlock from '@/components/formblocks/PriceInformationBlock';
import PaymentMethodBlock from '@/components/formblocks/PaymentMethodBlock';
import FinalizeBlock from '@/components/formblocks/FinalizeBlock';

export default function RentalFormPage() {
  const [formData, setFormData] = useState({
    customer: {},
    vacationAddress: {},
    extraServices: {},
    rentalPeriod: {},
    rentalItems: [],
    comments: "",
    paymentMethod: "",
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto p-6">
      {/* Linkerkolom */}
      <div className="space-y-6">
        <CustomerDetailsBlock 
          value={formData.customer}
          onChange={(data) => setFormData({ ...formData, customer: data })}
        />
        <VacationAddressBlock 
          value={formData.vacationAddress}
          onChange={(data) => setFormData({ ...formData, vacationAddress: data })}
        />
        <ExtraServicesBlock 
          value={formData.extraServices}
          onChange={(data) => setFormData({ ...formData, extraServices: data })}
        />
        <RentalPeriodBlock 
          value={formData.rentalPeriod}
          onChange={(data) => setFormData({ ...formData, rentalPeriod: data })}
        />
        <RentalItemsBlock 
          value={formData.rentalItems}
          onChange={(items) => setFormData({ ...formData, rentalItems: items })}
        />
        <CommentsBlock 
          value={formData.comments}
          onChange={(text) => setFormData({ ...formData, comments: text })}
        />
      </div>

      {/* Rechterkolom */}
      <div className="space-y-6">
        <PriceInformationBlock />
        <PaymentMethodBlock 
          value={formData.paymentMethod}
          onChange={(method) => setFormData({ ...formData, paymentMethod: method })}
        />
        <FinalizeBlock formData={formData} />
      </div>
    </div>
  );
} 