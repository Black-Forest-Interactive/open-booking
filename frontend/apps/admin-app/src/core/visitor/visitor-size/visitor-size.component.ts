import {Component, computed, input} from '@angular/core';
import {Visitor} from "@open-booking/core";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-visitor-size',
  imports: [
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './visitor-size.component.html',
  styleUrl: './visitor-size.component.scss',
})
export class VisitorSizeComponent {
  visitor = input.required<Visitor>()
  size = computed(() => this.visitor().size ?? 0)
  text = computed(() => this.size() <= 1 ? 'VISITOR.Person' : 'VISITOR.Persons')
}
