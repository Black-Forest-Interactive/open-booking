import {Component, computed, effect, input, output, signal} from '@angular/core';
import {BookingDetails} from "@open-booking/core";
import {groupBookingDetailsByDate} from "@open-booking/admin";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {DatePipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {BookingListEntryComponent} from "../booking-list-entry/booking-list-entry.component";

@Component({
  selector: 'app-booking-content',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    DatePipe,
    TranslatePipe,
    BookingListEntryComponent
  ],
  templateUrl: './booking-content.component.html',
  styleUrl: './booking-content.component.scss',
})
export class BookingContentComponent {
  entries = input.required<BookingDetails[]>()
  reloading = input<boolean>(false)
  currentUserId = input<string>('')
  isSearchActive = input<boolean>(false)

  reload = output<number>()

  groupedBookings = computed(() => groupBookingDetailsByDate(this.entries()))
  expandedGroups = signal<Record<string, boolean>>({});

  constructor() {
    effect(() => {
      const groups = this.groupedBookings()
      const expanded = this.expandedGroups()

      if (groups.length > 0 && Object.keys(expanded).every(key => !expanded[key])) {
        const firstGroup = groups[0]
        this.expandedGroups.set({
          [firstGroup.date + firstGroup.offerId]: true
        })
      }
    })
  }

  isGroupExpanded(groupId: string): boolean {
    return this.isSearchActive() || this.expandedGroups()[groupId];
  }

  toggleGroup(groupId: string): void {
    this.expandedGroups.update(groups => ({
      ...groups,
      [groupId]: !groups[groupId]
    }));
  }

  getInitials(name: string): string {
    if (!name) return '';

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
}
