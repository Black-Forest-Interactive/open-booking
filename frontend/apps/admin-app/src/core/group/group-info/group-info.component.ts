import {Component, input} from '@angular/core';
import {VisitorGroup} from "@open-booking/core";

@Component({
  selector: 'app-group-info',
  imports: [],
  templateUrl: './group-info.component.html',
  styleUrl: './group-info.component.scss',
})
export class GroupInfoComponent {
  data = input.required<VisitorGroup>()
}
