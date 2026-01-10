import {Component, computed} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {PortalClaimService} from "../portal-claim.service";

@Component({
  selector: 'app-claim-info',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './claim-info.component.html',
  styleUrl: './claim-info.component.scss',
})
export class ClaimInfoComponent {

  timeRemainingText = computed(() => {
    const diff = this.service.timeRemaining()

    if (!diff) {
      return '0s';
    }

    const duration = diff.shiftTo('days', 'hours', 'minutes', 'seconds')
    const days = Math.floor(duration.days)
    const hours = Math.floor(duration.hours)
    const minutes = Math.floor(duration.minutes)
    const seconds = Math.floor(duration.seconds)

    if (days > 0) {
      return `${days}d ${hours}h`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else if (seconds > 0) {
      return `${seconds}s`
    } else {
      return '0s'
    }
  })

  constructor(protected readonly service: PortalClaimService) {
  }


}
