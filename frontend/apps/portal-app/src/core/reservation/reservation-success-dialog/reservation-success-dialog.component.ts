import {Component, computed, inject, resource, signal} from '@angular/core';
import {ReservationService} from "@open-booking/portal";
import {Reservation} from "@open-booking/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {TranslatePipe} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-reservation-success-dialog',
  imports: [
    LoadingBarComponent,
    TranslatePipe,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './reservation-success-dialog.component.html',
  styleUrl: './reservation-success-dialog.component.scss',
})
export class ReservationSuccessDialogComponent {

  data = inject<Reservation>(MAT_DIALOG_DATA)
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
    public dialogRef: MatDialogRef<ReservationSuccessDialogComponent>,
    private service: ReservationService
  ) {
    this.requestId.set(this.data.id)
  }
}
