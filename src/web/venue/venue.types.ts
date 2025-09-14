export interface MockCity {
  city: string;
  code: string;
}

export interface VenueOpeningHour {
  id?: number;
  dayOfWeek: number; // 0=Sunday ... 6=Saturday
  openTime: string; // "06:00"
  closeTime: string; // "22:00"
  isActive: boolean;
}

export interface CreateVenueData {
  name: string;
  description?: string;
  address: string;
  city: MockCity;
  cityId?: number;
  districtId: number;
  country: string;
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
  email?: string;
  website?: string;
  amenities: string[];
  images: string[];
  openingHours: VenueOpeningHour[];
}
