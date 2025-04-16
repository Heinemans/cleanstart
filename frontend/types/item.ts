export interface Item {
  id: number
  item_number: string
  brand: string
  model_type: string
  gender: string
  brake_type: string
  frame_height: string
  wheel_size: string
  color: string
  year: number
  license_plate: string
  lock_type: string
  frame_number: string
  key_number: string
  lock_number: string
  status: 'available' | 'maintenance' | 'defect'
  item_type_id: number
  price_code_id: number
  created_at: string
  updated_at: string
  item_type?: {
    id: number
    name: string
  }
  price_code?: {
    id: number
    code: string
    label: string
  }
} 