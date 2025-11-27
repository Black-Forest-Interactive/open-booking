import {Component, Inject} from '@angular/core';
import {ResolvedResponse} from "../../response/model/response-api";
import {FormBuilder, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BookingRequestService} from "../model/booking-request.service";
import {BookingConfirmationContent, BookingRequestInfo} from "../model/booking-request-api";
import {BookingInfo} from "../../booking/model/booking-api";

@Component({
  selector: 'app-request-process-dialog',
  templateUrl: './request-process-dialog.component.html',
  styleUrls: ['./request-process-dialog.component.scss']
})
export class RequestProcessDialogComponent {

  loading: boolean = false

  response: ResolvedResponse | undefined

  title: string = ""

  confirm: string = ""

  fg = this.fb.group({
      subject: ['', Validators.required],
      content: ['', Validators.required],
      silent: [false, Validators.required],
    }
  )

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RequestProcessDialogData,
    public dialogRef: MatDialogRef<RequestProcessDialogComponent>,
    private fb: FormBuilder,
    private service: BookingRequestService
  ) {
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
