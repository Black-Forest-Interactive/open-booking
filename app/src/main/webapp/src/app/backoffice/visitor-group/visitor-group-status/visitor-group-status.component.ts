import {Component, Input} from '@angular/core';
import {ThemePalette} from "@angular/material/core";

@Component({
  selector: 'app-visitor-group-status',
  templateUrl: './visitor-group-status.component.html',
  styleUrls: ['./visitor-group-status.component.scss']
})
export class VisitorGroupStatusComponent {

  @Input() status: string = 'UNKNOWN'

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
