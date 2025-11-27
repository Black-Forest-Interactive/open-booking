import {Component, Input} from '@angular/core';
import {defaultVisitorGroup, VisitorGroup} from "../model/visitor-group-api";

@Component({
  selector: 'app-visitor-group-info',
  templateUrl: './visitor-group-info.component.html',
  styleUrls: ['./visitor-group-info.component.scss']
})
export class VisitorGroupInfoComponent {
  @Input() data: VisitorGroup = defaultVisitorGroup
}
