"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBoatTimes } from "@/lib/api/boat-times";
import { BoatTime } from "@/types/boat-time";

const formSchema = z.object({
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

type ExtraServicesFormValues = z.infer<typeof formSchema>;

interface ExtraServicesBlockProps {
  value?: Partial<ExtraServicesFormValues>;
  onChange?: (data: ExtraServicesFormValues) => void;
}

export default function ExtraServicesBlock({ value = {}, onChange }: ExtraServicesBlockProps) {
  // State to track form values and force re-renders
  const [formValues, setFormValues] = useState<ExtraServicesFormValues>({
    baggage_transport: value?.baggage_transport || false,
    baggage_pickup: value?.baggage_pickup || false,
    baggage_delivery: value?.baggage_delivery || false,
    transport_outbound: value?.transport_outbound || false,
    transport_return: value?.transport_return || false,
    transport_outbound_date: value?.transport_outbound_date || "",
    transport_outbound_time: value?.transport_outbound_time || "",
    transport_outbound_boat_time: value?.transport_outbound_boat_time || "",
    labelCountHeen: value?.labelCountHeen || 0,
    transport_return_date: value?.transport_return_date || "",
    transport_return_time: value?.transport_return_time || "",
    transport_return_boat_time: value?.transport_return_boat_time || "",
    labelCountTerug: value?.labelCountTerug || 0,
    boatTimeOut: value?.boatTimeOut || "",
    boatTimeReturn: value?.boatTimeReturn || "",
  });
  
  // State for validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State for boat times from API
  const [boatTimes, setBoatTimes] = useState<BoatTime[]>([]);
  // States for custom time selection
  const [customTimeOut, setCustomTimeOut] = useState(false);
  const [customTimeReturn, setCustomTimeReturn] = useState(false);
  // Loading state for boat times
  const [loading, setLoading] = useState(false);
  
  const form = useForm<ExtraServicesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formValues,
  });

  // Validation function for extra services
  function validateExtraServices(value: ExtraServicesFormValues) {
    const errors: Record<string, string> = {};

    // Validate outbound transport fields if outbound transport is enabled
    if (value.transport_outbound) {
      if (!value.transport_outbound_date) {
        errors.transport_outbound_date = "Datum is verplicht";
      }
      
      if (!value.transport_outbound_time) {
        errors.transport_outbound_time = "Tijd is verplicht";
      }
      
      if (!value.boatTimeOut) {
        errors.boatTimeOut = "Boottijd is verplicht";
      }
      
      if (value.labelCountHeen !== undefined && value.labelCountHeen < 0) {
        errors.labelCountHeen = "Aantal labels mag niet negatief zijn";
      }
    }

    // Validate return transport fields if return transport is enabled
    if (value.transport_return) {
      if (!value.transport_return_date) {
        errors.transport_return_date = "Datum is verplicht";
      }
      
      if (!value.transport_return_time) {
        errors.transport_return_time = "Tijd is verplicht";
      }
      
      if (!value.boatTimeReturn) {
        errors.boatTimeReturn = "Boottijd is verplicht";
      }
      
      if (value.labelCountTerug !== undefined && value.labelCountTerug < 0) {
        errors.labelCountTerug = "Aantal labels mag niet negatief zijn";
      }
    }

    return errors;
  }

  // Validate a specific field
  const validateField = (fieldName: string) => {
    const validationErrors = validateExtraServices(formValues);
    
    // Only update the error for the specific field
    setErrors(prev => ({
      ...prev,
      [fieldName]: validationErrors[fieldName] || ""
    }));
  };

  // Validate all fields
  const validateAllFields = () => {
    const validationErrors = validateExtraServices(formValues);
    setErrors(validationErrors);
  };

  // Fetch boat times on component mount
  useEffect(() => {
    fetchBoatTimes();
  }, []);

  // Fetch boat times from API
  const fetchBoatTimes = async () => {
    try {
      setLoading(true);
      const times = await getBoatTimes();
      setBoatTimes(times);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching boat times:", error);
      setLoading(false);
    }
  };

  // Format time string (HH:MM:SS) to HH:MM
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    
    // If it's already in HH:MM format, return as is
    if (timeString.length === 5) return timeString;
    
    // If it's in HH:MM:SS format, remove the seconds
    if (timeString.length === 8) return timeString.substring(0, 5);
    
    return timeString;
  };

  // Update state when props change
  useEffect(() => {
    // Check if the value has changed from previous render
    const newValues = {
      baggage_transport: value?.baggage_transport || false,
      baggage_pickup: value?.baggage_pickup || false,
      baggage_delivery: value?.baggage_delivery || false,
      transport_outbound: value?.transport_outbound || false,
      transport_return: value?.transport_return || false,
      transport_outbound_date: value?.transport_outbound_date || "",
      transport_outbound_time: value?.transport_outbound_time || "",
      transport_outbound_boat_time: value?.transport_outbound_boat_time || "",
      labelCountHeen: value?.labelCountHeen || 0,
      transport_return_date: value?.transport_return_date || "",
      transport_return_time: value?.transport_return_time || "",
      transport_return_boat_time: value?.transport_return_boat_time || "",
      labelCountTerug: value?.labelCountTerug || 0,
      boatTimeOut: value?.boatTimeOut || "",
      boatTimeReturn: value?.boatTimeReturn || "",
    };
    
    // Initialize custom time states based on values
    setCustomTimeOut(Boolean(newValues.boatTimeOut) && !boatTimes.some(bt => bt.time === newValues.boatTimeOut && bt.type === 'heen' && bt.active));
    setCustomTimeReturn(Boolean(newValues.boatTimeReturn) && !boatTimes.some(bt => bt.time === newValues.boatTimeReturn && bt.type === 'terug' && bt.active));
    
    setFormValues(newValues);
    form.reset(newValues);
  }, [value, form, boatTimes]);

  // Helper to update form values
  const updateFormValues = (newValues: ExtraServicesFormValues) => {
    setFormValues(newValues);
    form.reset(newValues);
    onChange?.(newValues);
  };

  // Handle checkbox changes
  const handleCheckboxChange = (fieldName: keyof ExtraServicesFormValues, checked: boolean) => {
    const newValues = {
      ...formValues,
      [fieldName]: checked
    };
    
    // If baggage_transport is unchecked, reset all related fields
    if (fieldName === 'baggage_transport' && !checked) {
      newValues.transport_outbound = false;
      newValues.transport_outbound_date = "";
      newValues.transport_outbound_time = "";
      newValues.transport_outbound_boat_time = "";
      newValues.labelCountHeen = 0;
      newValues.transport_return = false;
      newValues.transport_return_date = "";
      newValues.transport_return_time = "";
      newValues.transport_return_boat_time = "";
      newValues.labelCountTerug = 0;
      newValues.boatTimeOut = "";
      newValues.boatTimeReturn = "";
      
      // Clear all validation errors
      setErrors({});
    }
    
    // Reset date/time if transport is unchecked
    if (fieldName === 'transport_outbound' && !checked) {
      newValues.transport_outbound_date = "";
      newValues.transport_outbound_time = "";
      newValues.transport_outbound_boat_time = "";
      newValues.labelCountHeen = 0;
      newValues.boatTimeOut = "";
      
      // Clear outbound validation errors
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.transport_outbound_date;
        delete newErrors.transport_outbound_time;
        delete newErrors.boatTimeOut;
        delete newErrors.labelCountHeen;
        return newErrors;
      });
    } else if (fieldName === 'transport_outbound' && checked) {
      // Validate when enabling transport_outbound
      setTimeout(() => validateAllFields(), 0);
    }
    
    if (fieldName === 'transport_return' && !checked) {
      newValues.transport_return_date = "";
      newValues.transport_return_time = "";
      newValues.transport_return_boat_time = "";
      newValues.labelCountTerug = 0;
      newValues.boatTimeReturn = "";
      
      // Clear return validation errors
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.transport_return_date;
        delete newErrors.transport_return_time;
        delete newErrors.boatTimeReturn;
        delete newErrors.labelCountTerug;
        return newErrors;
      });
    } else if (fieldName === 'transport_return' && checked) {
      // Validate when enabling transport_return
      setTimeout(() => validateAllFields(), 0);
    }
    
    updateFormValues(newValues);
  };

  // Handle date/time input changes
  const handleDateTimeChange = (
    fieldName: 'transport_outbound_date' | 'transport_outbound_time' | 'transport_outbound_boat_time' | 
              'transport_return_date' | 'transport_return_time' | 'transport_return_boat_time', 
    value: string
  ) => {
    const newValues = {
      ...formValues,
      [fieldName]: value
    };
    
    // Clear the error for this field
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ""
      }));
    }
    
    updateFormValues(newValues);
  };

  // Handle boat time selection changes
  const handleBoatTimeChange = (type: 'heen' | 'terug', value: string) => {
    const field = type === 'heen' ? 'boatTimeOut' : 'boatTimeReturn';
    const customTimeField = type === 'heen' ? setCustomTimeOut : setCustomTimeReturn;
    
    // Check if "Anders..." option is selected
    if (value === 'custom') {
      customTimeField(true);
      return;
    }
    
    // Set custom time to false and update the value
    customTimeField(false);
    
    const newValues = {
      ...formValues,
      [field]: value
    };
    
    // Clear the error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
    
    updateFormValues(newValues);
  };

  // Handle custom time input changes
  const handleCustomTimeChange = (type: 'heen' | 'terug', value: string) => {
    const field = type === 'heen' ? 'boatTimeOut' : 'boatTimeReturn';
    
    const newValues = {
      ...formValues,
      [field]: value
    };
    
    // Clear the error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
    
    updateFormValues(newValues);
  };

  // Handle number input changes
  const handleNumberChange = (
    fieldName: 'labelCountHeen' | 'labelCountTerug',
    value: string
  ) => {
    const numberValue = value === '' ? 0 : parseInt(value, 10);
    
    const newValues = {
      ...formValues,
      [fieldName]: numberValue
    };
    
    // Clear the error for this field
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ""
      }));
    }
    
    updateFormValues(newValues);
  };

  // Filter boat times by type and active status
  const getFilteredBoatTimes = (type: 'heen' | 'terug') => {
    return boatTimes.filter(bt => bt.type === type && bt.active);
  };

  return (
    <div className="rounded-md border p-6 shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-6">Extra services</h2>

      <Form {...form}>
        <form className="space-y-6">
          {/* Top row of checkboxes */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="baggage_transport"
                checked={formValues.baggage_transport}
                onChange={(e) => handleCheckboxChange('baggage_transport', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="baggage_transport" className="font-medium">Bagagevervoer</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="baggage_pickup"
                checked={formValues.baggage_pickup}
                onChange={(e) => handleCheckboxChange('baggage_pickup', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="baggage_pickup" className="font-medium">Ophalen</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="baggage_delivery"
                checked={formValues.baggage_delivery}
                onChange={(e) => handleCheckboxChange('baggage_delivery', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="baggage_delivery" className="font-medium">Bezorgen</Label>
            </div>
          </div>

          {/* Baggage transport details */}
          {formValues.baggage_transport && (
            <div className="space-y-6">
              {/* Transport Heen - as a sentence */}
              <div className="grid grid-cols-[5rem_auto_auto_auto_auto_auto] gap-x-0 items-center">
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    id="transport_outbound"
                    checked={formValues.transport_outbound}
                    onChange={(e) => handleCheckboxChange('transport_outbound', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="transport_outbound" className="font-medium">Heen:</Label>
                </div>

                {formValues.transport_outbound ? (
                  <>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <input
                          type="date"
                          id="transport_outbound_date"
                          value={formValues.transport_outbound_date || ""}
                          onChange={(e) => handleDateTimeChange('transport_outbound_date', e.target.value)}
                          onBlur={() => validateField('transport_outbound_date')}
                          className={`rounded-md border ${errors.transport_outbound_date ? 'border-red-500' : 'border-gray-300'} px-2 py-1 text-sm w-32`}
                        />
                        <span className="text-sm mx-2">om</span>
                        <input
                          type="time"
                          id="transport_outbound_time"
                          value={formValues.transport_outbound_time || ""}
                          onChange={(e) => handleDateTimeChange('transport_outbound_time', e.target.value)}
                          onBlur={() => validateField('transport_outbound_time')}
                          className={`rounded-md border ${errors.transport_outbound_time ? 'border-red-500' : 'border-gray-300'} px-2 py-1 text-sm`}
                        />
                      </div>
                      {errors.transport_outbound_date && (
                        <p className="text-xs text-red-500 mt-1">{errors.transport_outbound_date}</p>
                      )}
                      {errors.transport_outbound_time && (
                        <p className="text-xs text-red-500 mt-1">{errors.transport_outbound_time}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Label htmlFor="boatTimeOut" className="whitespace-nowrap font-medium ml-2">Boot heen:</Label>
                        <div className="flex flex-col ml-1">
                          <Select
                            value={customTimeOut ? 'custom' : formValues.boatTimeOut}
                            onValueChange={(value) => handleBoatTimeChange('heen', value)}
                          >
                            <SelectTrigger className={`rounded-md border ${errors.boatTimeOut ? 'border-red-500' : 'border-gray-300'} px-2 py-1 text-sm w-[140px] bg-white h-[30px] min-h-[30px]`}>
                              <SelectValue placeholder="Kies tijd..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {getFilteredBoatTimes('heen').map((bt) => (
                                <SelectItem key={bt.id} value={bt.time}>
                                  {formatTime(bt.time)} {bt.service_type === 'sneldienst' && '⚡'}
                                </SelectItem>
                              ))}
                              <SelectItem value="custom">Anders...</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {customTimeOut && (
                            <input
                              type="time"
                              id="custom_boat_time_out"
                              value={formValues.boatTimeOut || ""}
                              onChange={(e) => handleCustomTimeChange('heen', e.target.value)}
                              onBlur={() => validateField('boatTimeOut')}
                              className={`rounded-md border ${errors.boatTimeOut ? 'border-red-500' : 'border-gray-300'} px-2 py-1 text-sm mt-1 h-[30px]`}
                            />
                          )}
                        </div>
                      </div>
                      {errors.boatTimeOut && (
                        <p className="text-xs text-red-500 mt-1">{errors.boatTimeOut}</p>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 justify-self-end">
                        <Label htmlFor="labelCountHeen" className="whitespace-nowrap font-medium">Labels:</Label>
                        <input
                          type="number"
                          id="labelCountHeen"
                          value={formValues.labelCountHeen || 0}
                          onChange={(e) => handleNumberChange('labelCountHeen', e.target.value)}
                          onBlur={() => validateField('labelCountHeen')}
                          min="0"
                          className={`rounded-md border ${errors.labelCountHeen ? 'border-red-500' : 'border-gray-300'} px-2 py-1 text-sm w-16`}
                        />
                      </div>
                      {errors.labelCountHeen && (
                        <p className="text-xs text-red-500 mt-1">{errors.labelCountHeen}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </>
                )}
              </div>

              {/* Transport Terug - as a sentence */}
              <div className="grid grid-cols-[5rem_auto_auto_auto_auto_auto] gap-x-0 items-center">
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    id="transport_return"
                    checked={formValues.transport_return}
                    onChange={(e) => handleCheckboxChange('transport_return', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="transport_return" className="font-medium">Terug:</Label>
                </div>

                {formValues.transport_return ? (
                  <>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <input
                          type="date"
                          id="transport_return_date"
                          value={formValues.transport_return_date || ""}
                          onChange={(e) => handleDateTimeChange('transport_return_date', e.target.value)}
                          onBlur={() => validateField('transport_return_date')}
                          className={`rounded-md border ${errors.transport_return_date ? 'border-red-500' : 'border-gray-300'} px-2 py-1 text-sm w-32`}
                        />
                        <span className="text-sm mx-2">om</span>
                        <input
                          type="time"
                          id="transport_return_time"
                          value={formValues.transport_return_time || ""}
                          onChange={(e) => handleDateTimeChange('transport_return_time', e.target.value)}
                          onBlur={() => validateField('transport_return_time')}
                          className={`rounded-md border ${errors.transport_return_time ? 'border-red-500' : 'border-gray-300'} px-2 py-1 text-sm`}
                        />
                      </div>
                      {errors.transport_return_date && (
                        <p className="text-xs text-red-500 mt-1">{errors.transport_return_date}</p>
                      )}
                      {errors.transport_return_time && (
                        <p className="text-xs text-red-500 mt-1">{errors.transport_return_time}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Label htmlFor="boatTimeReturn" className="whitespace-nowrap font-medium ml-2">Boot terug:</Label>
                        <div className="flex flex-col ml-1">
                          <Select
                            value={customTimeReturn ? 'custom' : formValues.boatTimeReturn}
                            onValueChange={(value) => handleBoatTimeChange('terug', value)}
                          >
                            <SelectTrigger className={`rounded-md border ${errors.boatTimeReturn ? 'border-red-500' : 'border-gray-300'} px-2 py-1 text-sm w-[140px] bg-white h-[30px] min-h-[30px]`}>
                              <SelectValue placeholder="Kies tijd..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {getFilteredBoatTimes('terug').map((bt) => (
                                <SelectItem key={bt.id} value={bt.time}>
                                  {formatTime(bt.time)} {bt.service_type === 'sneldienst' && '⚡'}
                                </SelectItem>
                              ))}
                              <SelectItem value="custom">Anders...</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {customTimeReturn && (
                            <input
                              type="time"
                              id="custom_boat_time_return"
                              value={formValues.boatTimeReturn || ""}
                              onChange={(e) => handleCustomTimeChange('terug', e.target.value)}
                              onBlur={() => validateField('boatTimeReturn')}
                              className={`rounded-md border ${errors.boatTimeReturn ? 'border-red-500' : 'border-gray-300'} px-2 py-1 text-sm mt-1 h-[30px]`}
                            />
                          )}
                        </div>
                      </div>
                      {errors.boatTimeReturn && (
                        <p className="text-xs text-red-500 mt-1">{errors.boatTimeReturn}</p>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 justify-self-end">
                        <Label htmlFor="labelCountTerug" className="whitespace-nowrap font-medium">Labels:</Label>
                        <input
                          type="number"
                          id="labelCountTerug"
                          value={formValues.labelCountTerug || 0}
                          onChange={(e) => handleNumberChange('labelCountTerug', e.target.value)}
                          onBlur={() => validateField('labelCountTerug')}
                          min="0"
                          className={`rounded-md border ${errors.labelCountTerug ? 'border-red-500' : 'border-gray-300'} px-2 py-1 text-sm w-16`}
                        />
                      </div>
                      {errors.labelCountTerug && (
                        <p className="text-xs text-red-500 mt-1">{errors.labelCountTerug}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </>
                )}
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
} 