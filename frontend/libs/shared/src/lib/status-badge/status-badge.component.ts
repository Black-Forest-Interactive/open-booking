import {Component, input} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'lib-status-badge',
  imports: [
    MatIconModule,
    TranslatePipe,
    MatTooltip
  ],
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  statusClass = input<string>()
  showText = input(true)
  icon = input.required<string>()
  text = input.required<string>()
}
