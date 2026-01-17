import {Component, computed, input} from '@angular/core';
import {Visitor, VisitorChangeRequest, VisitorType} from "@open-booking/core";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-visitor-info',
  imports: [
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './visitor-info.component.html',
  styleUrl: './visitor-info.component.scss',
})
export class VisitorInfoComponent {
  data = input.required<Visitor | VisitorChangeRequest>()

  type = computed(() => this.data().type ?? VisitorType.SINGLE)
  size = computed(() => this.data().size ?? 0)
  title = computed(() => this.data().title ?? '')
  name = computed(() => this.data().name ?? '')
  email = computed(() => this.data().email ?? '')
  phone = computed(() => this.data().phone ?? '')
  minAge = computed(() => this.data().minAge ?? 0)
  maxAge = computed(() => this.data().maxAge ?? 0)
  description = computed(() => this.data().description ?? '')
  street = computed(() => this.data().address.street ?? '')
  zip = computed(() => this.data().address.zip ?? '')
  city = computed(() => this.data().address.city ?? '')

  isGroup = computed(() => this.type() === VisitorType.GROUP)
  address = computed(() => this.zip() + " " + this.city() + " " + this.street() + " ")
}
