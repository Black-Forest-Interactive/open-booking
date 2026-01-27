import {Component, inject} from '@angular/core';
import {BookingConfirmationContent, BookingInfo, BookingRequestInfo, ResolvedResponse} from "@open-booking/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RequestService} from "@open-booking/admin";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {QuillModule} from "ngx-quill";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-request-process-dialog',
  imports: [
    MatDialogModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    QuillModule
  ],
  templateUrl: './request-process-dialog.component.html',
  styleUrl: './request-process-dialog.component.scss',
})
export class RequestProcessDialogComponent {

  data = inject<RequestProcessDialogData>(MAT_DIALOG_DATA)

  loading: boolean = false

  response: ResolvedResponse | undefined

  title: string = ""
  confirm: string = ""

  fg: FormGroup

  constructor(
    public dialogRef: MatDialogRef<RequestProcessDialogComponent>,
    private fb: FormBuilder,
    private service: RequestService
  ) {
    this.fg = fb.group({
        subject: ['', Validators.required],
        content: ['', Validators.required],
        silent: [false, Validators.required],
      }
    )
  }

  ngOnInit(): void {
    this.loadResponse()
    this.title = (this.data.confirmation) ? 'REQUEST.Dialog.Confirm.Title' : 'REQUEST.Dialog.Deny.Title'
    this.confirm = (this.data.confirmation) ? 'REQUEST.Action.Confirm' : 'REQUEST.Action.Deny'
  }

  private loadResponse() {
    if (this.loading) return
    this.loading = true

    if (this.data.confirmation) {
      if (!this.data.selectedBooking) return
      this.service.getConfirmationMessage(this.data.info.id, this.data.selectedBooking.id).subscribe(r => this.handleResolvedResponse(r))
    } else {
      this.service.getDenialMessage(this.data.info.id).subscribe(r => this.handleResolvedResponse(r))
    }
  }

  private handleResolvedResponse(response: ResolvedResponse) {
    this.response = response
    this.fg.setValue({
      subject: response.title,
      content: response.content,
      silent: false
    })
    this.loading = false
  }

  onCancelClick(): void {
    this.dialogRef.close(null)
  }

  onConfirmClick() {
    if (this.fg.invalid) return
    let value = this.fg.value
    let content = new BookingConfirmationContent(
      value.subject ?? "",
      value.content ?? "",
      value.silent ?? false
    )
    this.dialogRef.close(content)
  }

}

export interface RequestProcessDialogData {
  info: BookingRequestInfo,
  selectedBooking: BookingInfo,
  confirmation: boolean
}
