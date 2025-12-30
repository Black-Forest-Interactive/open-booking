import {Component, computed} from '@angular/core';
import {AppService} from "../../../app/app.service";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";
import {BookingProcessService} from "../booking-process.service";
import {TranslatePipe} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {navigateToBooking} from "../../../app/app.navigation";

@Component({
  selector: 'app-booking-toolbar-entry',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    TranslatePipe,
  ],
  templateUrl: './booking-toolbar-entry.component.html',
  styleUrl: './booking-toolbar-entry.component.scss',
})
export class BookingToolbarEntryComponent {

  cartCount = computed(() => this.service.entries().length)

  constructor(protected readonly appService: AppService, private service: BookingProcessService, private router: Router) {
  }

  protected openCart() {
    navigateToBooking(this.router)
  }
}
