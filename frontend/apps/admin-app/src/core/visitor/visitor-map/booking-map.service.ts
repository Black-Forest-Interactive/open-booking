import {inject, Injectable, signal} from '@angular/core';
import {forkJoin} from 'rxjs';
import {MapStatsService} from './map-stats.service';
import {BookingService} from "@open-booking/admin";
import {ActiveFilters} from "./map-stats.model";
import {BookingSearchRequest} from "@open-booking/core";

const PAGE_SIZE = 500;

@Injectable({providedIn: 'root'})
export class BookingMapService {

  private readonly bookingService = inject(BookingService);
  private readonly mapStats = inject(MapStatsService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly progress = signal<{ loaded: number; total: number } | null>(null);

  load(filters?: ActiveFilters): void {
    this.loading.set(true);
    this.error.set(null);
    this.progress.set(null);

    const request = this.buildRequest(filters);

    // 1. Erste Seite laden um totalPages zu ermitteln
    this.bookingService.searchBooking(request, 0, PAGE_SIZE).subscribe({
      next: first => {
        const totalPages = first.result.totalPages;
        const allBookings = [...first.result.content];
        this.progress.set({loaded: 1, total: totalPages});

        if (totalPages <= 1) {
          this.mapStats.loadBookings(allBookings);
          this.loading.set(false);
          this.progress.set(null);
          return;
        }

        // 2. Alle weiteren Seiten parallel laden
        const remaining$ = Array.from(
          {length: totalPages - 1},
          (_, i) => this.bookingService.searchBooking(request, i + 1, PAGE_SIZE)
        );

        forkJoin(remaining$).subscribe({
          next: pages => {
            pages.forEach(p => allBookings.push(...p.result.content));
            this.mapStats.loadBookings(allBookings);
            this.loading.set(false);
            this.progress.set(null);
          },
          error: err => this.handleError(err),
        });
      },
      error: err => this.handleError(err),
    });
  }

  private handleError(err: unknown): void {
    console.error('BookingMapService error', err);
    this.error.set('Daten konnten nicht geladen werden.');
    this.loading.set(false);
    this.progress.set(null);
  }

  private buildRequest(filters?: ActiveFilters): BookingSearchRequest {
    return new BookingSearchRequest(
      filters?.search ?? '',
      filters?.statuses ?? [],
      filters?.types ?? [],
      [],                          // verificationStatus – leer lassen
      filters?.dateFrom ?? null,
      filters?.dateTo ?? null,
    );
  }
}
