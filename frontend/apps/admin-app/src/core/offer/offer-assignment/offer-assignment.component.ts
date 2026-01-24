import {Component, computed, input} from '@angular/core';
import {Assignment} from "@open-booking/core";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-offer-assignment',
  imports: [
    TranslatePipe
  ],
  templateUrl: './offer-assignment.component.html',
  styleUrl: './offer-assignment.component.scss',
})
export class OfferAssignmentComponent {
  assignment = input.required<Assignment>()

  otherReservedSpace = input(0)

  bookedSpace = computed(() => this.assignment().confirmedSpace)
  reservedSpace = computed(() => this.assignment().pendingSpace)
  availableSpace = computed(() => this.assignment().availableSpace)
  totalSpace = computed(() => this.bookedSpace() + this.reservedSpace() + this.availableSpace())

  availablePercentage = computed(() => (this.availableSpace() / this.totalSpace()) * 100)
  bookedPercentage = computed(() => (this.bookedSpace() / this.totalSpace()) * 100)
  otherReservedPercentage = computed(() => (this.otherReservedSpace() / this.totalSpace()) * 100)
  visitorPercentage = computed(() => (this.otherReservedSpace() / this.totalSpace()) * 100)
  isUnconfirmed = computed(() => this.otherReservedSpace() > 0)
}
