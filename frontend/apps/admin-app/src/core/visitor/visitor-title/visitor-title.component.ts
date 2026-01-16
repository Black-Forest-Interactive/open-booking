import {Component, input} from '@angular/core';
import {Visitor, VisitorType} from "@open-booking/core";

@Component({
  selector: 'app-visitor-title',
  imports: [],
  templateUrl: './visitor-title.component.html',
  styleUrl: './visitor-title.component.scss',
})
export class VisitorTitleComponent {
  data = input.required<Visitor>()
  protected readonly VisitorType = VisitorType;
}
