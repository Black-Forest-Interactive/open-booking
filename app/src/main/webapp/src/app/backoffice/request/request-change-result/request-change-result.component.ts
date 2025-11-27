import {Component, Inject} from '@angular/core';
import {GenericRequestResult} from "../../../shared/shared-api";
import {BookingRequestInfo} from "../model/booking-request-api";
import {HotToastRef} from "@ngneat/hot-toast";

@Component({
  selector: 'app-request-change-result',
  templateUrl: './request-change-result.component.html',
  styleUrls: ['./request-change-result.component.scss']
})
export class RequestChangeResultComponent {
  result: GenericRequestResult = this.toastRef.data.result
  data: BookingRequestInfo = this.toastRef.data.data

  constructor(@Inject(HotToastRef) public toastRef: HotToastRef<Content>) {
  }

}

export interface Content {
  result: GenericRequestResult,
  data: BookingRequestInfo
}
