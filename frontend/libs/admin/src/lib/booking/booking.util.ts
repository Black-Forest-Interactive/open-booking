import {BookingDetails, BookingStatus, VerificationStatus} from "@open-booking/core";

export interface GroupedBookings {
  date: string;
  offerId: number;
  timeRange: string;
  entries: BookingDetails[];
  totalEntries: number;
  openCount: number;
}

export function groupBookingDetailsByDate(entries: BookingDetails[]): GroupedBookings[] {
  const groups = new Map<string, GroupedBookings>()

  entries.forEach(entry => {
    const date = new Date(entry.offer.offer.start).toDateString();
    const key = `${date}-${entry.offer.offer.id}`;

    if (!groups.has(key)) {
      groups.set(key, {
        date: entry.offer.offer.start,
        offerId: entry.offer.offer.id,
        timeRange: formatTimeRange(entry.offer.offer.start, entry.offer.offer.finish),
        entries: [],
        totalEntries: 0,
        openCount: 0
      });
    }

    const group = groups.get(key)!;
    group.entries.push(entry);
    group.totalEntries++;
  });

  // Sort groups by date and time
  return Array.from(groups.values()).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }).map(group => ({
    ...group,
    entries: sortEntriesWithinGroup(group.entries)
  }))
}


function sortEntriesWithinGroup(entries: BookingDetails[]): BookingDetails[] {
  return entries.sort((a, b) => {
    // Priority 1: Reservations being edited first
    const aEditing = a.editor ? 0 : 1
    const bEditing = b.editor ? 0 : 1
    if (aEditing !== bEditing) return aEditing - bEditing

    // Priority 2: status
    const aStatus = getStatusPriority(a.booking.status)
    const bStatus = getStatusPriority(b.booking.status)
    if (aStatus !== bStatus) return aStatus > bStatus ? 1 : -1

    // Priority 3: Unconfirmed visitors
    const aUnconfirmed = a.visitor.verification.status === VerificationStatus.UNCONFIRMED ? 0 : 1
    const bUnconfirmed = b.visitor.verification.status === VerificationStatus.UNCONFIRMED ? 0 : 1
    if (aUnconfirmed !== bUnconfirmed) return aUnconfirmed - bUnconfirmed

    // Priority 4: Newest first (by timestamp)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  });
}

function getStatusPriority(status: BookingStatus): number {
  switch (status) {
    case "PENDING":
      return 0
    case "CONFIRMED":
      return 1
    case "DECLINED":
      return 2
    case "EXPIRED":
      return 3
    case "CANCELLED":
      return 4
    case "UNKNOWN":
      return 5
  }
  return 6
}


function formatTimeRange(start: string, finish: string): string {
  const startDate = new Date(start);
  const finishDate = new Date(finish);

  const startTime = startDate.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const finishTime = finishDate.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `${startTime} - ${finishTime}`;
}
