import {Component, input} from '@angular/core';
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
}
