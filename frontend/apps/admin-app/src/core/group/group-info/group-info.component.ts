import {Component, computed, input} from '@angular/core';
import {VisitorGroup} from "@open-booking/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-group-info',
  imports: [
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    TranslatePipe,

  ],
  templateUrl: './group-info.component.html',
  styleUrl: './group-info.component.scss',
})
export class GroupInfoComponent {
  data = input.required<VisitorGroup>()

  title = computed(() => this.data().title)
  size = computed(() => this.data().size)
  isGroup = computed(() => this.data().isGroup)
  minAge = computed(() => this.data().minAge)
  maxAge = computed(() => this.data().maxAge)
  contact = computed(() => this.data().contact)
  address = computed(() => this.data().address)
  street = computed(() => this.address()?.street ?? '')
  zip = computed(() => this.address()?.zip ?? '')
  city = computed(() => this.address()?.city ?? '')
  phone = computed(() => this.data().phone)
  email = computed(() => this.data().email)

}
