import {Component, computed, effect, inject, resource} from '@angular/core';
import {ReservationConfirmationContent, ReservationOfferEntry, ReservationSearchEntry} from "@open-booking/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {ReservationService} from "@open-booking/admin";
import {toPromise} from "@open-booking/shared";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {QuillModule} from "ngx-quill";
import {MatInputModule} from "@angular/material/input";
import {TranslatePipe} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-reservation-process-dialog',
  imports: [
    MatDialogModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    QuillModule,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './reservation-process-dialog.component.html',
  styleUrl: './reservation-process-dialog.component.scss',
})
export class ReservationProcessDialogComponent {
  data = inject<ReservationProcessDialogData>(MAT_DIALOG_DATA)

  private resource = resource({
    loader: param =>
      toPromise((this.data.confirmation) ? this.service.getConfirmationMessage(this.data.info.reservation.id, this.data.offer.offer.id) : this.service.getDenialMessage(this.data.info.reservation.id), param.abortSignal)
  })

  loading = this.resource.isLoading
  response = computed(() => this.resource.value())

  title = (this.data.confirmation) ? 'RESERVATION.Dialog.Confirm.Title' : 'RESERVATION.Dialog.Deny.Title'
  confirm = (this.data.confirmation) ? 'RESERVATION.Action.Confirm' : 'RESERVATION.Action.Deny'

  fg: FormGroup

  constructor(
    public dialogRef: MatDialogRef<ReservationProcessDialogComponent>,
    fb: FormBuilder,
    private service: ReservationService
  ) {
    this.fg = fb.group({
        subject: ['', Validators.required],
        content: ['', Validators.required],
        silent: [false, Validators.required],
      }
    )
    effect(() => {
      let response = this.response()
      if (response) this.fg.patchValue({
        subject: response.title,
        content: response.content,
        silent: false
      })
    });
  }

  onCancelClick(): void {
    this.dialogRef.close(null)
  }

  onConfirmClick() {
    if (this.fg.invalid) return
    let value = this.fg.value
    let content = new ReservationConfirmationContent(
      value.subject ?? "",
      value.content ?? "",
      value.silent ?? false
    )
    this.dialogRef.close(content)
  }
}

export interface ReservationProcessDialogData {
  info: ReservationSearchEntry,
  offer: ReservationOfferEntry,
  confirmation: boolean
}
