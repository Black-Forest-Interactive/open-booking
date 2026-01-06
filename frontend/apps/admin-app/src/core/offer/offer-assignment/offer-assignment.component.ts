import {Component, computed, input} from '@angular/core';
import {Assignment} from "@open-booking/core";

@Component({
  selector: 'app-offer-assignment',
  imports: [],
  templateUrl: './offer-assignment.component.html',
  styleUrl: './offer-assignment.component.scss',
})
export class OfferAssignmentComponent {
  assignment = input.required<Assignment>()

  otherReservedSpace = input(0)

  bookedSpace = computed(() => this.assignment().bookedSpace)
  reservedSpace = computed(() => this.assignment().reservedSpace)
  availableSpace = computed(() => this.assignment().availableSpace)
  totalSpace = computed(() => this.bookedSpace() + this.reservedSpace() + this.availableSpace())

  availablePercentage = computed(() => (this.availableSpace() / this.totalSpace()) * 100)
  bookedPercentage = computed(() => (this.bookedSpace() / this.totalSpace()) * 100)
  otherReservedPercentage = computed(() => (this.otherReservedSpace() / this.totalSpace()) * 100)
  visitorPercentage = computed(() => (this.otherReservedSpace() / this.totalSpace()) * 100)
  isUnconfirmed = computed(() => this.otherReservedSpace() > 0)
}
