export interface CreateCourtData {
  name: string;
  description?: string;
  surface?: string;
  size?: string;
  images: string[];
  sportIds: number[];
  venueId: number;
  pricing: CreateCourtPricing[];
}

interface CreateCourtPricing {
  sportId?: number;
  name: string;
  dayOfWeek?: number | null;
  startTime: string;
  endTime: string;
  pricePerHour: number;
  minimumDuration: number;
  validFrom?: string;
  validUntil?: string;
}
