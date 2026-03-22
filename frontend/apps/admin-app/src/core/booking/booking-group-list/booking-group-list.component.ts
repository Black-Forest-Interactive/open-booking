import {Component, ContentChild, input, output, TemplateRef} from '@angular/core'
import {GroupedBookings} from "@open-booking/admin"
import {MatIconModule} from "@angular/material/icon"
import {DatePipe, KeyValuePipe, NgTemplateOutlet} from "@angular/common"
import {TranslatePipe} from "@ngx-translate/core"
import {DashboardSummaryComponent} from "../../dashboard/dashboard-summary/dashboard-summary.component"
import {BookingStatus, DaySummary, WeekSummary} from "@open-booking/core"
import {BookingStatusComponent} from "@open-booking/shared"

@Component({
  selector: 'app-booking-group-list',
  imports: [
    MatIconModule,
    DatePipe,
    TranslatePipe,
    NgTemplateOutlet,
    DashboardSummaryComponent,
    KeyValuePipe,
    BookingStatusComponent
  ],
  templateUrl: './booking-group-list.component.html',
  styleUrl: './booking-group-list.component.scss',
})
export class BookingGroupListComponent {

  data = input.required<GroupedBookings[]>()
  noDataFoundTitle = input('')
  noDataFoundDescription = input('')
  isSearchActive = input<boolean>(false)

  selectionWeekChanged = output<WeekSummary>()
  selectionDayChanged = output<DaySummary | undefined>()

  @ContentChild(TemplateRef, {static: false}) entryTemplate!: TemplateRef<any>

  asBookingStatus(key: string): BookingStatus {
    return key as BookingStatus
  }
}
