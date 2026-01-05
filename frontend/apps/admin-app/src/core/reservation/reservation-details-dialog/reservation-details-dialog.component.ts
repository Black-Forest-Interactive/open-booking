import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {TranslatePipe} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {ReservationDetailsComponent} from "../reservation-details/reservation-details.component";

@Component({
  selector: 'app-reservation-details-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
    ReservationDetailsComponent
  ],
  templateUrl: './reservation-details-dialog.component.html',
  styleUrl: './reservation-details-dialog.component.scss',
})
export class ReservationDetailsDialogComponent {
  reservationId = inject<number>(MAT_DIALOG_DATA)
}
