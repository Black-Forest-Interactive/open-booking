import {VisitorGroup} from "../group/group.api";
import {StaffMember} from "../staff/staff.api";


export interface WeekSummary {
  weekNumber: number;
  startDate: string; // LocalDate
  endDate: string;   // LocalDate
  unconfirmedCount: number;
  days: DaySummary[];
}

export interface DaySummary {
  date: string; // LocalDate
  unconfirmedCount: number;
}


export interface OfferEntry {
  id: number,
  start: string,
  finish: string,
  color: string,
  totalSeats: number,
  confirmedSeats: number,
  pendingSeats: number,
  active: boolean,
  guide: StaffMember | undefined,
  bookings: BookingEntry[]
}

export interface BookingEntry {
  id: number,
  visitorGroup: VisitorGroup,
  confirmed: boolean,
  status: string,
  comment: string,
  emailSent: boolean,
  emailDelivered: boolean,
  timestamp: string
}
