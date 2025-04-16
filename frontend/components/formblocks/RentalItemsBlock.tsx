"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

// Define the item type
interface RentalItem {
  id: string;
  item_number: string;
  start_date: Date;
  end_date: Date;
  price: number;
  discount: string;
  total: number;
}

// Define the error type for validation
interface ItemErrors {
  item_number?: string;
  start_date?: string;
  end_date?: string;
}

interface RentalItemsBlockProps {
  value?: RentalItem[];
  onChange?: (items: RentalItem[]) => void;
}

export default function RentalItemsBlock({ value = [], onChange }: RentalItemsBlockProps) {
  const [itemInput, setItemInput] = useState("");
  const [items, setItems] = useState<RentalItem[]>(value);
  const [errors, setErrors] = useState<Record<string, ItemErrors>>({});
  const isInitialMount = useRef(true);
  const prevValueRef = useRef<RentalItem[]>(value);

  // Helper to compare arrays
  const arraysEqual = (a: RentalItem[], b: RentalItem[]) => {
    if (a.length !== b.length) return false;
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch (e) {
      // Fallback for circular structures
      return false;
    }
  };

  // Validation function for rental items
  const validateRentalItems = (item: RentalItem): ItemErrors => {
    const itemErrors: ItemErrors = {};
    
    // Validate item_number
    if (!item.item_number || item.item_number.trim() === "") {
      itemErrors.item_number = "Itemnummer is vereist";
    }
    
    // Validate start_date
    if (!item.start_date) {
      itemErrors.start_date = "Startdatum is vereist";
    }
    
    // Validate end_date
    if (!item.end_date) {
      itemErrors.end_date = "Einddatum is vereist";
    } else if (item.start_date && item.end_date < item.start_date) {
      itemErrors.end_date = "Einddatum mag niet vóór startdatum liggen";
    }
    
    return itemErrors;
  };

  // Handle validation on blur
  const validateField = (id: string, field: keyof ItemErrors) => {
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    const itemErrors = validateRentalItems(item);
    const currentErrors = errors[id] || {};
    
    // Only update errors for the specific field
    if (itemErrors[field]) {
      setErrors(prev => ({
        ...prev,
        [id]: { ...currentErrors, [field]: itemErrors[field] }
      }));
    } else {
      // Clear error for this field if it was previously set
      if (currentErrors[field]) {
        const newFieldErrors = { ...currentErrors };
        delete newFieldErrors[field];
        
        setErrors(prev => {
          const newErrors = { ...prev };
          if (Object.keys(newFieldErrors).length) {
            newErrors[id] = newFieldErrors;
          } else {
            delete newErrors[id];
          }
          return newErrors;
        });
      }
    }
  };

  // Reset specific field error on change
  const clearFieldError = (id: string, field: keyof ItemErrors) => {
    if (errors[id]?.[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[id]) {
          const fieldErrors = { ...newErrors[id] };
          delete fieldErrors[field];
          
          if (Object.keys(fieldErrors).length) {
            newErrors[id] = fieldErrors;
          } else {
            delete newErrors[id];
          }
        }
        return newErrors;
      });
    }
  };

  // Sync items with value prop, but only if they've changed
  useEffect(() => {
    // Skip the first render to avoid initial double updates
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevValueRef.current = value;
      return;
    }

    // Only update local state if the props actually changed
    if (!arraysEqual(value, prevValueRef.current)) {
      setItems(value);
      prevValueRef.current = value;
    }
  }, [value]);

  // Notify parent of changes, but only on user actions, not from prop changes
  useEffect(() => {
    // Skip the first render
    if (isInitialMount.current) {
      return;
    }

    // Don't trigger onChange if the items were just updated from props
    if (!arraysEqual(items, prevValueRef.current)) {
      onChange?.(items);
      prevValueRef.current = items;
    }
  }, [items, onChange]);

  // Function to handle adding a new item
  const handleAddItem = () => {
    if (!itemInput.trim()) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create a new item with default values
    const newItem: RentalItem = {
      id: Date.now().toString(), // Simple unique ID
      item_number: itemInput.trim(),
      start_date: today,
      end_date: today,
      price: 0, // Default price (would be calculated based on item in a real app)
      discount: "0%", // Default discount
      total: 0, // Default total (would be calculated)
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setItemInput(""); // Clear the input
  };

  // Function to update start date
  const handleStartDateChange = (id: string, date: Date) => {
    clearFieldError(id, 'start_date');
    
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const newItem = { ...item, start_date: date };
        // Ensure end date is not before start date
        if (newItem.end_date < date) {
          newItem.end_date = date;
          clearFieldError(id, 'end_date');
        }
        // Recalculate total (simplified for demo)
        newItem.total = calculateTotal(newItem);
        return newItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

  // Function to update end date
  const handleEndDateChange = (id: string, date: Date) => {
    clearFieldError(id, 'end_date');
    
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const newItem = { ...item, end_date: date };
        // Recalculate total (simplified for demo)
        newItem.total = calculateTotal(newItem);
        return newItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

  // Update item number
  const handleItemNumberChange = (id: string, value: string) => {
    clearFieldError(id, 'item_number');
    
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, item_number: value };
      }
      return item;
    });
    setItems(updatedItems);
  };

  // Function to calculate the total price (simplified)
  const calculateTotal = (item: RentalItem) => {
    // Calculate days (including both start and end dates)
    const diffTime = Math.abs(item.end_date.getTime() - item.start_date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Parse discount percentage (remove % and convert to number)
    const discountPercent = parseFloat(item.discount) || 0;
    
    // Calculate total price
    const subtotal = item.price * diffDays;
    const discountAmount = subtotal * (discountPercent / 100);
    return subtotal - discountAmount;
  };

  // Function to remove an item
  const removeItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    
    // Clean up errors for the removed item
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-4 rounded-md border p-4 shadow-sm bg-white">
      <h2 className="text-lg font-semibold">Verhuurde items</h2>

      <div className="flex items-center gap-4">
        <Input 
          placeholder="Voer itemnummer in" 
          value={itemInput} 
          onChange={(e) => setItemInput(e.target.value)}
        />
        <Button onClick={handleAddItem}>Toevoegen</Button>
      </div>

      {items.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Itemnummer</TableHead>
              <TableHead>Startdatum</TableHead>
              <TableHead>Einddatum</TableHead>
              <TableHead>Prijs</TableHead>
              <TableHead>Korting</TableHead>
              <TableHead>Totaal</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="space-y-1">
                    <Input 
                      value={item.item_number}
                      onChange={(e) => handleItemNumberChange(item.id, e.target.value)}
                      onBlur={() => validateField(item.id, 'item_number')}
                      className={errors[item.id]?.item_number ? "border-red-500" : ""}
                    />
                    {errors[item.id]?.item_number && (
                      <p className="text-red-500 text-xs">{errors[item.id]?.item_number}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Input 
                      type="date"
                      value={item.start_date instanceof Date ? item.start_date.toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : new Date();
                        handleStartDateChange(item.id, date);
                      }}
                      onBlur={() => validateField(item.id, 'start_date')}
                      className={errors[item.id]?.start_date ? "border-red-500" : ""}
                    />
                    {errors[item.id]?.start_date && (
                      <p className="text-red-500 text-xs">{errors[item.id]?.start_date}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Input 
                      type="date"
                      value={item.end_date instanceof Date ? item.end_date.toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : new Date();
                        handleEndDateChange(item.id, date);
                      }}
                      onBlur={() => validateField(item.id, 'end_date')}
                      className={errors[item.id]?.end_date ? "border-red-500" : ""}
                    />
                    {errors[item.id]?.end_date && (
                      <p className="text-red-500 text-xs">{errors[item.id]?.end_date}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>€{item.price.toFixed(2)}</TableCell>
                <TableCell>{item.discount}</TableCell>
                <TableCell>€{item.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Trash2 
                    onClick={() => removeItem(item.id)} 
                    className="cursor-pointer text-red-500" 
                    size={18}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
} 