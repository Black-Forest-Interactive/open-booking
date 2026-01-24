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
  highlightReservedSpace = input(0)

  confirmedSpace = computed(() => this.assignment().confirmedSpace)
  pendingSpace = computed(() => this.assignment().pendingSpace)
  availableSpace = computed(() => this.assignment().availableSpace)
  deactivatedSpace = computed(() => this.assignment().deactivatedSpace)

  totalSpace = computed(() => this.confirmedSpace() + this.pendingSpace() + this.availableSpace() + this.deactivatedSpace())

  confirmedPercentage = computed(() => (this.confirmedSpace() / this.totalSpace()) * 100)
  pendingPercentage = computed(() => ((this.pendingSpace() - this.highlightReservedSpace()) / this.totalSpace()) * 100)
  highlightPendingPercentage = computed(() => (this.highlightReservedSpace() / this.totalSpace()) * 100)
  availablePercentage = computed(() => (this.availableSpace() / this.totalSpace()) * 100)

  isHighlighted = computed(() => this.highlightReservedSpace() > 0)
}
