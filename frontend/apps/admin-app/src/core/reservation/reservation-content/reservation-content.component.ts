import {Component, computed, input, output} from '@angular/core';
import {ReservationDetails, ReservationStatus} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TranslatePipe} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {
  ReservationOfferCapacityVisualizationComponent
} from "../reservation-offer-capacity-visualization/reservation-offer-capacity-visualization.component";
import {RouterLink} from "@angular/router";
import {MatTooltipModule} from "@angular/material/tooltip";
import {VisitorTitleComponent} from "../../visitor/visitor-title/visitor-title.component";
import {VisitorSizeComponent} from "../../visitor/visitor-size/visitor-size.component";
import {EditorInfoComponent} from "../../editor/editor-info/editor-info.component";
import {ReservationStatusComponent, VerificationStatusComponent, VisitorTypeComponent} from "@open-booking/shared";

interface GroupedReservations {
  date: string;
  offerId: number;
  timeRange: string;
  entries: ReservationDetails[];
  totalReservations: number;
  openCount: number;
}


@Component({
  selector: 'app-reservation-content',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TranslatePipe,
    DatePipe,
    VisitorTypeComponent,
    ReservationOfferCapacityVisualizationComponent,
    RouterLink,
    ReservationStatusComponent,
    VisitorTitleComponent,
    VisitorSizeComponent,
    EditorInfoComponent,
    ReservationStatusComponent,
    VerificationStatusComponent,
    VisitorTypeComponent
  ],
  templateUrl: './reservation-content.component.html',
  styleUrl: './reservation-content.component.scss',
})
export class ReservationContentComponent {
  entries = input.required<ReservationDetails[]>();
  reloading = input<boolean>(false);
  currentUserId = input<string>('')

  reload = output<number>();

  // Group reservations by date and offer
  groupedEntries = computed(() => {
    const entries = this.entries();
    const groups = new Map<string, GroupedReservations>();

    entries.forEach(entry => {
      const date = new Date(entry.offer.offer.start).toDateString();
      const key = `${date}-${entry.offer.offer.id}`;

      if (!groups.has(key)) {
        groups.set(key, {
          date: entry.offer.offer.start,
          offerId: entry.offer.offer.id,
          timeRange: this.formatTimeRange(entry.offer.offer.start, entry.offer.offer.finish),
          entries: [],
          totalReservations: 0,
          openCount: 0
        });
      }

      const group = groups.get(key)!;
      group.entries.push(entry);
      group.totalReservations++;

      if (this.isOpenStatus(entry.reservation.status)) {
        group.openCount++;
      }
    });

    // Sort groups by date and time
    return Array.from(groups.values()).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }).map(group => ({
      ...group,
      entries: this.sortEntriesWithinGroup(group.entries)
    }));
  });

  private sortEntriesWithinGroup(entries: ReservationDetails[]): ReservationDetails[] {
    return entries.sort((a, b) => {
      // Priority 1: Open reservations first
      const aOpen = this.isOpenStatus(a.reservation.status) ? 0 : 1;
      const bOpen = this.isOpenStatus(b.reservation.status) ? 0 : 1;
      if (aOpen !== bOpen) return aOpen - bOpen;

      // Priority 2: Reservations being edited first
      const aEditing = a.editor ? 0 : 1;
      const bEditing = b.editor ? 0 : 1;
      if (aEditing !== bEditing) return aEditing - bEditing;

      // Priority 3: Unconfirmed visitors
      const aUnconfirmed = a.visitor.verification.status === 'UNCONFIRMED' ? 0 : 1;
      const bUnconfirmed = b.visitor.verification.status === 'UNCONFIRMED' ? 0 : 1;
      if (aUnconfirmed !== bUnconfirmed) return aUnconfirmed - bUnconfirmed;

      // Priority 4: Oldest first (by timestamp)
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  }

  private isOpenStatus(status: ReservationStatus): boolean {
    // Adjust these based on your actual status values
    return status === 'UNKNOWN' || status === 'UNCONFIRMED';
  }

  private formatTimeRange(start: string, finish: string): string {
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


  isCurrentUser(userId: string): boolean {
    return userId === this.currentUserId()
  }

}
