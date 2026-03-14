import {BookingDetails, BookingStatus, VisitorType} from "@open-booking/core";

export interface PlzCluster {
  zip: string;
  city: string;
  lat: number;
  lng: number;
  count: number;
  totalPersons: number;
  statusBreakdown: Record<BookingStatus, number>;
  typeBreakdown: Record<VisitorType, number>;
  bookings: BookingDetails[];
}

export interface MapStats {
  totalBookings: number;
  totalPersons: number;
  uniqueZips: number;
  topZip: string;
  clusters: PlzCluster[];
  statusSummary: Record<BookingStatus, number>;
  typeSummary: Record<VisitorType, number>;
}

export interface ActiveFilters {
  statuses: BookingStatus[];
  types: VisitorType[];
  dateFrom?: string;
  dateTo?: string;
  search: string;
}
