import {Component, input, output} from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatChipsModule} from "@angular/material/chips";
import {TranslatePipe} from "@ngx-translate/core";
import {OfferInfo} from "@open-booking/core";
import {DatePipe} from "@angular/common";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-offer-table',
  imports: [
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLink,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './offer-table.component.html',
  styleUrl: './offer-table.component.scss',
})
export class OfferTableComponent {

  displayedColumns: string[] = ['start', 'finish', 'maxPersons', 'active', 'cmd']

  reloading = input(false)
  entries = input.required<OfferInfo[]>()


  edit = output<OfferInfo>()
  delete = output<OfferInfo>()
  toggleActive = output<OfferInfo>()
}
