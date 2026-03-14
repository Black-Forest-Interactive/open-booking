import {computed, Injectable, signal} from '@angular/core';
import {BookingDetails, BookingStatus, VisitorType} from "@open-booking/core";
import {ActiveFilters, MapStats, PlzCluster} from "./map-stats.model";
import {HttpClient} from "@angular/common/http";


@Injectable({providedIn: 'root'})
export class MapStatsService {

  private readonly _allBookings = signal<BookingDetails[]>([]);
  private readonly _filters = signal<ActiveFilters>({
    statuses: [BookingStatus.CONFIRMED, BookingStatus.PENDING],
    types: [],
    search: '',
  });

  readonly filters = this._filters.asReadonly();

  readonly filteredBookings = computed(() => {
    const f = this._filters();
    return this._allBookings().filter(b => {
      if (f.statuses.length && !f.statuses.includes(b.booking.status)) return false;
      if (f.types.length && !f.types.includes(b.visitor.type)) return false;
      if (f.dateFrom && b.booking.created < f.dateFrom) return false;
      if (f.dateTo && b.booking.created > f.dateTo) return false;
      if (f.search) {
        const q = f.search.toLowerCase();
        return (
          b.visitor.name.toLowerCase().includes(q) ||
          b.visitor.address.zip.includes(q) ||
          b.visitor.address.city.toLowerCase().includes(q) ||
          b.booking.key.toLowerCase().includes(q)
        );
      }
      return true;
    });
  });

  readonly stats = computed<MapStats>(() => {
    const bookings = this.filteredBookings();
    const clusterMap = new Map<string, PlzCluster>();

    for (const bd of bookings) {
      const zip = bd.visitor.address.zip;
      const geo = this.resolveGeo(zip);
      if (!geo) continue;

      if (!clusterMap.has(zip)) {
        clusterMap.set(zip, {
          zip,
          city: bd.visitor.address.city,
          lat: geo.lat,
          lng: geo.lng,
          count: 0,
          totalPersons: 0,
          statusBreakdown: {} as Record<BookingStatus, number>,
          typeBreakdown: {} as Record<VisitorType, number>,
          bookings: [],
        });
      }

      const cluster = clusterMap.get(zip)!;
      cluster.count++;
      cluster.totalPersons += bd.visitor.size;
      cluster.statusBreakdown[bd.booking.status] = (cluster.statusBreakdown[bd.booking.status] ?? 0) + 1;
      cluster.typeBreakdown[bd.visitor.type] = (cluster.typeBreakdown[bd.visitor.type] ?? 0) + 1;
      cluster.bookings.push(bd);
    }

    const clusters = Array.from(clusterMap.values()).sort((a, b) => b.count - a.count);
    const statusSummary = {} as Record<BookingStatus, number>;
    const typeSummary = {} as Record<VisitorType, number>;

    for (const bd of bookings) {
      statusSummary[bd.booking.status] = (statusSummary[bd.booking.status] ?? 0) + 1;
      typeSummary[bd.visitor.type] = (typeSummary[bd.visitor.type] ?? 0) + 1;
    }

    return {
      totalBookings: bookings.length,
      totalPersons: bookings.reduce((s, b) => s + b.visitor.size, 0),
      uniqueZips: clusterMap.size,
      topZip: clusters[0]?.zip ?? '-',
      clusters,
      statusSummary,
      typeSummary,
    };
  });

  private db = new Map<string, { lat: number; lng: number }>()

  constructor(private http: HttpClient) {
    this.http.get('/plz_geocoord.csv', {responseType: 'text'})
      .subscribe(csv => {
        csv.split('\n').slice(1).forEach(line => {
          const [plz, lat, lon] = line.split(',');
          if (plz) this.db.set(plz.trim(), {lat: +lat, lng: +lon});
        });
      });
  }

  loadBookings(data: BookingDetails[]): void {
    this._allBookings.set(data);
  }

  updateFilters(patch: Partial<ActiveFilters>): void {
    this._filters.update(f => ({...f, ...patch}));
  }

  resetFilters(): void {
    this._filters.set({statuses: [], types: [], search: ''});
  }

  private resolveGeo(zip: string): { lat: number; lng: number } | null {
    if (this.db.has(zip)) return this.db.get(zip)!;
    // Fuzzy-Fallback: ersten 4 Ziffern matchen
    const prefix = zip.substring(0, 4);
    for (const [key, val] of this.db) {
      if (key.startsWith(prefix)) return val;
    }
    return null;
  }
}
