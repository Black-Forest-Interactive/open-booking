import {Component, input, output} from '@angular/core';
import {Visitor, VisitorChangeRequest} from "@open-booking/core";

@Component({
  selector: 'app-visitor-change',
  imports: [],
  templateUrl: './visitor-change.component.html',
  styleUrl: './visitor-change.component.scss',
})
export class VisitorChangeComponent {
  data = input.required<Visitor>()
  changeEvent = output<VisitorChangeRequest>()
}
