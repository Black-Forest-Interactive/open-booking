import {Component, input} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'lib-status-badge',
  imports: [
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  statusClass = input<string>()
  icon = input.required<string>()
  text = input.required<string>()
}
