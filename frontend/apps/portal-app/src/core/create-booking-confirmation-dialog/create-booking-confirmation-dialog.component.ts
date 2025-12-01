import {Component, computed, inject, resource, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {TranslatePipe} from "@ngx-translate/core";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {BookingRequest} from "@open-booking/core";
import {BookingService} from "@open-booking/portal";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-create-booking-confirmation-dialog',
  imports: [
    LoadingBarComponent,
    TranslatePipe,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './create-booking-confirmation-dialog.component.html',
  styleUrls: ['./create-booking-confirmation-dialog.component.scss']
})
export class CreateBookingConfirmationDialogComponent {

  data = inject<BookingRequest>(MAT_DIALOG_DATA)
  requestId = signal(-1)
  messageResource = resource({
    params: this.requestId,
    loader: (param) => {
      return toPromise(
        this.service.getRequestReceivedMessage(param.params),
        param.abortSignal
      );
    },
  });

  message = computed(() => this.messageResource.value())
  title = computed(() => this.message()?.title ?? '')
  content = computed(() => this.message()?.content ?? '')
  reloading = this.messageResource.isLoading

  constructor(
    public dialogRef: MatDialogRef<CreateBookingConfirmationDialogComponent>,
    private service: BookingService
  ) {
    this.requestId.set(this.data.id)
  }

}
