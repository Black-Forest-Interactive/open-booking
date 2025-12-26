export interface CalendarResponse {
  weeks: WeekSummary[];
  dailyOffers: DailyOffers[];
}

export interface WeekSummary {
  weekNumber: number;
  startDate: string; // LocalDate
  endDate: string;   // LocalDate
  pendingCount: number;
  days: DaySummary[];
}

export interface DaySummary {
  date: string; // LocalDate
  dayOfWeek: string;
  pendingCount: number;
}

export interface DailyOffers {
  date: string; // LocalDate
  offers: ShowOffer[];
}

export interface ShowOffer {
  id: string;
  showName: string;
  guide: string;
  color: string;
  timeSlot: string;
  totalSeats: number;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  guests: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  comment: string | null;
  confirmed: boolean;
  emailSent: boolean;
  emailDelivered: boolean;
  createdAt: string; // LocalDateTime
}

export class DailyOffersFilterRequest {
  constructor(
    public guide: string,
    public status: string,
    public showName: string
  ) {
  }
}
