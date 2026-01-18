import {Component, computed, input, signal} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {HotToastService} from "@ngxpert/hot-toast";
import {OfferSearchEntry, ReservationStatus} from "@open-booking/core";
import {DatePipe} from "@angular/common";
import {
  DashboardContentEntryReservationComponent
} from "../dashboard-content-entry-reservation/dashboard-content-entry-reservation.component";

@Component({
  selector: 'app-dashboard-content-entry',
  imports: [
    MatIcon,
    MatIconButton,
    MatFormFieldModule,
    MatSelectModule,
    DatePipe,
    DashboardContentEntryReservationComponent
  ],
  templateUrl: './dashboard-content-entry.component.html',
  styleUrl: './dashboard-content-entry.component.scss',
})
export class DashboardContentEntryComponent {
  data = input.required<OfferSearchEntry>()

  availableSpace = computed(() => this.data().assignment.availableSpace)
  bookedSpace = computed(() => this.data().assignment.confirmedSpace)
  reservedSpace = computed(() => this.data().assignment.pendingSpace)

  reservations = computed(() => this.data().reservations.filter(r => r.status === ReservationStatus.UNCONFIRMED))

  collapsed = signal<boolean>(false)

  constructor(private toast: HotToastService) {
  }


  protected toggleEditingColor() {
    this.toast.error("Change color is not implemented yet")
  }

  protected toggleShowCollapse() {
    this.collapsed.set(!this.collapsed())
  }


  protected selectGuide() {
    this.toast.error("Select guide is not implemented yet")
  }

}
