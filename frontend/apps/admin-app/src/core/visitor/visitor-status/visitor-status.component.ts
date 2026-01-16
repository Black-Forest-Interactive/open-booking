import {Component, computed, input} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {MatIconModule} from "@angular/material/icon";
import {VerificationStatus, Visitor} from "@open-booking/core";

const classes: Record<string, string> = {
  CONFIRMED: 'text-green-700 bg-green-50  border-green-200',
  UNCONFIRMED: 'text-orange-700 bg-orange-50 border-orange-200',
  EXPIRED: 'text-red-700 bg-red-50 border-red-200',
  UNKNOWN: 'text-gray-700 bg-gray-50  border-gray-200'
}

const icons: Record<string, string> = {
  CONFIRMED: 'check_circle',
  UNCONFIRMED: 'schedule',
  EXPIRED: 'error',
  UNKNOWN: 'help'
}


@Component({
  selector: 'app-visitor-status',
  imports: [
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './visitor-status.component.html',
  styleUrl: './visitor-status.component.scss',
})
export class VisitorStatusComponent {

  visitor = input.required<Visitor>()
  status = computed(() => this.visitor().verification.status ?? VerificationStatus.UNKNOWN)
  statusClass = computed(() => classes[this.status()] || classes['UNKNOWN'])
  statusIcon = computed(() => icons[this.status()] || classes['UNKNOWN'])
  text = computed(() => 'VISITOR.Status.' + this.status())

}
