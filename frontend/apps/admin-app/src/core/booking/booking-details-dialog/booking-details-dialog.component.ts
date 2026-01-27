import {Component, inject, signal} from '@angular/core';
import {BookingDetails} from "@open-booking/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {TranslatePipe} from "@ngx-translate/core";
import {BookingDetailViewComponent} from "../booking-detail-view/booking-detail-view.component";

@Component({
  selector: 'app-booking-details-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    TranslatePipe,
    BookingDetailViewComponent
  ],
  templateUrl: './booking-details-dialog.component.html',
  styleUrl: './booking-details-dialog.component.scss',
})
export class BookingDetailsDialogComponent {
  data = inject<BookingDetails>(MAT_DIALOG_DATA)

  editMode = signal(false)

  constructor(private reference: MatDialogRef<BookingDetailsDialogComponent>) {
  }

  protected close(reload: boolean) {
    this.reference.close(reload)
  }

  protected toggleEditMode() {
    this.editMode.set(!this.editMode())
  }
}
