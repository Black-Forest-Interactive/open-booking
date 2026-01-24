import {Component, computed, input} from '@angular/core';
import {VisitorType} from "@open-booking/core";
import {StatusBadgeComponent} from "../status-badge/status-badge.component";

const icons: Record<VisitorType, string> = {
  GROUP: 'groups',
  SINGLE: 'person'
};

@Component({
  selector: 'lib-visitor-type',
  imports: [
    StatusBadgeComponent
  ],
  templateUrl: './visitor-type.component.html',
  styleUrl: './visitor-type.component.scss',
})
export class VisitorTypeComponent {
  data = input.required<VisitorType>()
  showText = input(true)
  
  icon = computed(() => icons[this.data()] || 'person')
  text = computed(() => 'VISITOR.Type.' + this.data())
}
