export interface PriceList {
  id: number;
  name: string;
  description?: string;
  valid_from?: string;
  valid_until?: string;
  active?: boolean;
  created_at: string;
  updated_at: string;
} 