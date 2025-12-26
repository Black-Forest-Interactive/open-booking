import {Component, input, output} from '@angular/core';
import {VisitorGroup, VisitorGroupChangeRequest} from "@open-booking/core";

@Component({
  selector: 'app-group-change',
  imports: [],
  templateUrl: './group-change.component.html',
  styleUrl: './group-change.component.scss',
})
export class GroupChangeComponent {
  data = input.required<VisitorGroup>()
  changeEvent = output<VisitorGroupChangeRequest>()
}
