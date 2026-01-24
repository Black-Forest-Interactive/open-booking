import {Component, computed, input, output, signal} from '@angular/core';
import {BookingDetails, DaySummary, WeekSummary} from "@open-booking/core";
import {groupBookingDetailsByDate} from "@open-booking/admin";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {BookingGroupListComponent} from "../booking-group-list/booking-group-list.component";
import {BookingListEntryComponent} from "../booking-list-entry/booking-list-entry.component";
import {BookingDetailsComponent} from "../booking-details/booking-details.component";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-booking-content',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    BookingGroupListComponent,
    BookingListEntryComponent,
    BookingDetailsComponent,
    TranslatePipe
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
  reload = output<number>()

  groupedBookings = computed(() => groupBookingDetailsByDate(this.entries()))

  onEntrySelected(entry: BookingDetails) {
    this.selectedEntry.set(entry)
  }

  closeDetails() {
    this.selectedEntry.set(undefined)
  }

}
