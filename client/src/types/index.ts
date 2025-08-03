export interface Opportunity {
  id: number;
  title: string;
  description: string;
  organization: string;
  location: string;
  type: 'clinical_trial' | 'volunteer' | 'research';
  requirements: string;
  compensation: string;
  url: string;
  image_url?: string;
  date_posted?: string;
  created_at?: string;
}

export interface SwipeResult {
  opportunityId: number;
  direction: 'left' | 'right';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}