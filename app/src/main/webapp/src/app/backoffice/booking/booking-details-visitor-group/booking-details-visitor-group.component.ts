import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BookingRequestInfo, defaultBookingRequestInfo} from "../../request/model/booking-request-api";
import {VisitorGroupChangeRequest} from "../../visitor-group/model/visitor-group-api";
import {BookingRequestService} from "../../request/model/booking-request.service";
import {HotToastService} from "@ngneat/hot-toast";
import {TranslateService} from '@ngx-translate/core';
import {GenericRequestResult} from "../../../shared/shared-api";

@Component({
  selector: 'app-booking-details-visitor-group',
  templateUrl: './booking-details-visitor-group.component.html',
  styleUrls: ['./booking-details-visitor-group.component.scss']
})
export class BookingDetailsVisitorGroupComponent {
  @Input() data: BookingRequestInfo = defaultBookingRequestInfo
  @Output() requestReload = new EventEmitter<Boolean>()

  editMode: boolean = false

  changing: boolean = false

  constructor(private service: BookingRequestService, private toastService: HotToastService, private translate: TranslateService) {
  }

  handleGroupChange(request: VisitorGroupChangeRequest | undefined) {
    if (!request) {
      this.editMode = false
      return
    }
    if (this.changing) return
    this.changing = true
    this.service.updateBookingRequestVisitorGroup(this.data, request).subscribe(
      {
        next: (result) => this.handleResult(result)
      }
    )
  }

  private handleResult(result: GenericRequestResult) {
    let message = this.translate.instant(result.msg)
    if (result.success) {
      this.toastService.success(message)
    } else {
      this.toastService.error(message)
    }
    this.changing = false
    this.editMode = false
    this.requestReload.emit(true)
  }
}
