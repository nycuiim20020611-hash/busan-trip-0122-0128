export interface ItineraryItem {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  activity: string;
  location?: string;
  notes?: string;
  category: 'food' | 'activity' | 'transport' | 'shopping' | 'other';
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  category: 'essential' | 'booking' | 'clothes' | 'other';
}

export type WishlistCategory = 'food' | 'shopping' | 'stay' | 'transport' | 'fun';

export interface WishlistItem {
  id: string;
  name: string;
  note: string;
  url?: string;
  category: WishlistCategory;
  checked: boolean;
}

export enum TabView {
  HOME = 'HOME',
  ITINERARY = 'ITINERARY',
  CHECKLIST = 'CHECKLIST',
  INFO = 'INFO',
  WISHLIST = 'WISHLIST'
}

export interface DailyForecast {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

export interface WeatherData {
  current: {
    temperature: number;
    weathercode: number;
  };
  daily?: DailyForecast;
}