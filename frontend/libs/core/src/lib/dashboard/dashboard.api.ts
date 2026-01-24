import {Assignment} from "../offer/offer.api";
import {BookingStatus} from "../booking/booking.api";


export interface WeekSummary {
  weekNumber: number
  startDate: string
  endDate: string
}

export interface DaySummary {
  date: string;
  assignment: Assignment,
  bookingStats: Record<BookingStatus, number>,
  recentlyChangedOffer: number,
  recentlyChangedBookings: number,
}
