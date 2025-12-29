import {Component, computed, inject, resource, signal} from '@angular/core';
import {BookingService} from "@open-booking/portal";
import {BookingRequest} from "@open-booking/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {TranslatePipe} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-booking-success-dialog',
  imports: [
    LoadingBarComponent,
    TranslatePipe,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './booking-success-dialog.component.html',
  styleUrl: './booking-success-dialog.component.scss',
})
export class BookingSuccessDialogComponent {

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
    public dialogRef: MatDialogRef<BookingSuccessDialogComponent>,
    private service: BookingService
  ) {
    this.requestId.set(this.data.id)
  }
}
