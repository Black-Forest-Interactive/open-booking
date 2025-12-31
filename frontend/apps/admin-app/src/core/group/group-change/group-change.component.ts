import {Component, input, output} from '@angular/core';
import {Visitor, VisitorChangeRequest} from "@open-booking/core";

@Component({
  selector: 'app-group-change',
  imports: [],
  templateUrl: './group-change.component.html',
  styleUrl: './group-change.component.scss',
})
export class GroupChangeComponent {
  data = input.required<Visitor>()
  changeEvent = output<VisitorChangeRequest>()
}
