export interface PriceListLink {
  id: number;
  price_list_id: number;
  price_code_id: number;
  active: boolean;
  daily_prices: number[];
  price_extra_day: number;
  created_at: string;
  updated_at: string;
}

export interface PriceListLinkWithDetails extends PriceListLink {
  price_code_name: string;
  price_code_code: string;
  price_list_name: string;
  price_list_valid_from?: string;
  price_list_valid_until?: string;
} 