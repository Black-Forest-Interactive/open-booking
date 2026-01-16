import {Component, computed, input} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {Visitor, VisitorType} from "@open-booking/core";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-visitor-type',
  imports: [
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './visitor-type.component.html',
  styleUrl: './visitor-type.component.scss',
})
export class VisitorTypeComponent {
  data = input.required<Visitor>()

  visitorTypeIcon = computed(() => {
    const type = this.data().type;
    const icons: Record<VisitorType, string> = {
      GROUP: 'groups',
      SINGLE: 'person'
    };
    return icons[type] || 'person';
  })

  text = computed(() => 'VISITOR.Type.' + this.data().type)
}
