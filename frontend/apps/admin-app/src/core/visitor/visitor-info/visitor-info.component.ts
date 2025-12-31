import {Component, computed, input} from '@angular/core';
import {Visitor} from "@open-booking/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-visitor-info',
  imports: [
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    TranslatePipe,

  ],
  templateUrl: './visitor-info.component.html',
  styleUrl: './visitor-info.component.scss',
})
export class VisitorInfoComponent {
  data = input.required<Visitor>()

  type = computed(() => this.data().type)
  title = computed(() => this.data().title)
  description = computed(() => this.data().description)
  size = computed(() => this.data().size)
  minAge = computed(() => this.data().minAge)
  maxAge = computed(() => this.data().maxAge)
  name = computed(() => this.data().name)

  address = computed(() => this.data().address)
  street = computed(() => this.address()?.street ?? '')
  zip = computed(() => this.address()?.zip ?? '')
  city = computed(() => this.address()?.city ?? '')
  phone = computed(() => this.data().phone)
  email = computed(() => this.data().email)

  verification = computed(() => this.data().verification)
  verificationStatus = computed(() => this.verification().status)
  verifiedAt = computed(() => this.verification().timestamp)

}
