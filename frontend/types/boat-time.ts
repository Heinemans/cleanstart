export interface BoatTime {
  id: number;
  time: string; // TIME format in ISO string
  type: 'heen' | 'terug' | 'overig';
  service_type: 'gewoon' | 'sneldienst';
  active: boolean;
  created_at: string;
  updated_at: string;
} 