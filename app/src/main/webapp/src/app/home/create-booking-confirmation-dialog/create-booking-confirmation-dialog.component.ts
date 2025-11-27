import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HomeService} from "../model/home.service";
import {TranslateService} from "@ngx-translate/core";
import {defaultResolvedResponse, ResolvedResponse} from "../../backoffice/response/model/response-api";
import {BookingRequest} from "../../backoffice/request/model/booking-request-api";

@Component({
  selector: 'app-create-booking-confirmation-dialog',
  templateUrl: './create-booking-confirmation-dialog.component.html',
  styleUrls: ['./create-booking-confirmation-dialog.component.scss']
})
export class CreateBookingConfirmationDialogComponent {

  loading: boolean = false

  info: ResolvedResponse = defaultResolvedResponse

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BookingRequest,
    public dialogRef: MatDialogRef<CreateBookingConfirmationDialogComponent>,
    private service: HomeService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.loading = true
    this.service.getRequestReceivedMessage(this.data.id, this.translateService.currentLang).subscribe(r => this.handleData(r))
  }

  private handleData(r: ResolvedResponse) {
    this.info = r
    this.loading = false
  }
}
