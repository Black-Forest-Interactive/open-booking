import {Component, computed} from '@angular/core';
import {AppService} from "../../../app/app.service";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";
import {ReservationProcessService} from "../reservation-process.service";
import {TranslatePipe} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {navigateToReservation} from "../../../app/app.navigation";

@Component({
  selector: 'app-reservation-toolbar-entry',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    TranslatePipe,
  ],
  templateUrl: './reservation-toolbar-entry.component.html',
  styleUrl: './reservation-toolbar-entry.component.scss',
})
export class ReservationToolbarEntryComponent {

  cartCount = computed(() => this.service.entries().length)

  constructor(protected readonly appService: AppService, private service: ReservationProcessService, private router: Router) {
  }

  protected openCart() {
    navigateToReservation(this.router)
  }
}
