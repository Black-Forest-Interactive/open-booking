import {Component, input} from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {MatChip} from "@angular/material/chips";

@Component({
  selector: 'app-group-status',
  imports: [
    MatChip
  ],
  templateUrl: './group-status.component.html',
  styleUrl: './group-status.component.scss',
})
export class GroupStatusComponent {

  status = input('UNKNOWN')

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
