import {Component, computed, effect, input, output, signal} from '@angular/core';
import {BookingDetails, DaySummary, WeekSummary} from "@open-booking/core";
import {groupBookingDetailsByDate} from "@open-booking/admin";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {BookingGroupListComponent} from "../booking-group-list/booking-group-list.component";
import {BookingListEntryComponent} from "../booking-list-entry/booking-list-entry.component";
import {BookingDetailViewComponent} from "../booking-detail-view/booking-detail-view.component";

@Component({
  selector: 'app-booking-content',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    BookingGroupListComponent,
    BookingListEntryComponent,
    BookingDetailViewComponent
  ],
  templateUrl: './booking-content.component.html',
  styleUrl: './booking-content.component.scss',
})
export class BookingContentComponent {
  entries = input.required<BookingDetails[]>()
  selectedEntry = signal<BookingDetails | undefined>(undefined)
  reloading = input<boolean>(false)
  currentUserId = input<string>('')
  isSearchActive = input<boolean>(false)

  selectionWeekChanged = output<WeekSummary>()
  selectionDayChanged = output<DaySummary | undefined>()
  reload = output<boolean>()

  groupedBookings = computed(() => groupBookingDetailsByDate(this.entries()))

  constructor() {
    effect(() => {
      const currentEntries = this.entries()
      const selected = this.selectedEntry()

      if (!selected) return

      const updatedEntry = currentEntries.find(e => e.booking.id === selected.booking.id)
      if (updatedEntry) {
        this.selectedEntry.set(updatedEntry)
      } else {
        this.selectedEntry.set(undefined)
      }
    })
  }

  onEntrySelected(entry: BookingDetails) {
    this.selectedEntry.set(entry)
  }

  closeDetails() {
    this.selectedEntry.set(undefined)
  }

}
