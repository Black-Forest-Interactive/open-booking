import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BookingRequestInfo, defaultBookingRequestInfo} from "../../request/model/booking-request-api";
import {BookingRequestService} from "../../request/model/booking-request.service";
import {FormControl} from "@angular/forms";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";

@Component({
  selector: 'app-booking-details-comment',
  templateUrl: './booking-details-comment.component.html',
  styleUrls: ['./booking-details-comment.component.scss'],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ]
})
export class BookingDetailsCommentComponent {

  @Input() set data(value: BookingRequestInfo) {
    this.comment = value.comment
    this._data = value
  }

  get data(): BookingRequestInfo {
    return this._data
  }

  // @ts-ignore
  private _data: BookingRequestInfo = defaultBookingRequestInfo
  @Output() change = new EventEmitter<Boolean>()

  editCommentStatus: string = 'show'
  comment : string = ""

  constructor(private service: BookingRequestService) {
  }

  edit() {
    if (this.editCommentStatus == 'show') this.editCommentStatus = 'edit'
  }

  save(comment: string) {
    if (this.editCommentStatus != 'edit') return
    this.editCommentStatus = 'updating'
    this.service.setComment(this.data.id, comment).subscribe(result => {
      this.editCommentStatus = 'show'
      if (result) this.change.emit(true)
    })
  }

  cancel() {
    if (this.editCommentStatus != 'edit') return
    this.editCommentStatus = 'show'
  }

}
