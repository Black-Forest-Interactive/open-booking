import {BookingStatus} from "@open-booking/core";

export interface Statistics {
  totalActiveOfferSpace: number,
  totalDeactivatedOfferSpace: number,
  offersByDay: DailyOfferStats[],
  spaceByDay: DailySpaceStats[],
  bookingStatusDistribution: Record<BookingStatus, BookingStatusStats>,
  visitorTypeDistribution: Record<string, number>,
  verificationStatusDistribution: Record<string, number>,
  avgConfirmedSpace: number,
  avgPendingSpace: number,
  avgAvailableSpace: number,
  totalMaxSpace: number,
  totalConfirmedSpace: number,
  totalPendingSpace: number,
  totalAvailableSpace: number
}

export interface BookingStatusStats {
  count: number,
  totalSeats: number
}

export interface DailyBookingStats {
  date: string,
  count: number
}

export interface DailyOfferStats {
  date: string,
  count: number
}

export interface DailySpaceStats {
  date: string,
  totalSpace: number,
  confirmedSpace: number,
  pendingSpace: number,
  availableSpace: number
}
