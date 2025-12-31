import {Component, computed, input} from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {MatChip} from "@angular/material/chips";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-visitor-status',
  imports: [
    MatChip,
    TranslatePipe
  ],
  templateUrl: './visitor-status.component.html',
  styleUrl: './visitor-status.component.scss',
})
export class VisitorStatusComponent {

  status = input('UNKNOWN')

  text = computed(() => 'VISITOR_GROUP.Status.' + this.status())

  getColor(status: string): ThemePalette {
    if (status == 'CONFIRMED') {
      return 'accent'
    }
    if (status == 'UNCONFIRMED') {
      return 'warn'
    }
    return undefined
  }
}
