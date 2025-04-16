export interface BaggageTime {
  id: number;
  time: string; // TIME format in ISO string
  type: 'heen' | 'terug' | 'overig';
  active: boolean;
  created_at: string;
  updated_at: string;
} 