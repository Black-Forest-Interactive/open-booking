import {Injectable} from '@angular/core';
import {BaseService} from "../../../shared/base-service";
import {HttpClient} from "@angular/common/http";
import {LoggingService} from "../../../shared/logging/logging.service";
import {BehaviorSubject, EMPTY, map, Observable, switchMap, tap} from "rxjs";
import {Page} from "../../../shared/page/page";
import {BookingConfirmationContent, BookingRequest, BookingRequestChangeRequest, BookingRequestFilterRequest, BookingRequestInfo} from "./booking-request-api";
import {GenericRequestResult} from "../../../shared/shared-api";
import {ResolvedResponse} from "../../response/model/response-api";
import {RequestProcessDialogComponent} from "../request-process-dialog/request-process-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {BookingInfo} from "../../booking/model/booking-api";
import {TranslateService} from "@ngx-translate/core";
import {HotToastService} from "@ngneat/hot-toast";
import {VisitorGroupChangeRequest} from "../../visitor-group/model/visitor-group-api";
import {RequestChangeResultComponent} from "../request-change-result/request-change-result.component";

@Injectable({
  providedIn: 'root'
})
export class BookingRequestService extends BaseService {

  constructor(http: HttpClient, logging: LoggingService, private dialog: MatDialog, private translationService: TranslateService, private toastService: HotToastService,) {
    super(http, 'backend/request', logging)
    this.retryCount = 1
  }

  getAllBookingRequest(page: number, size: number): Observable<Page<BookingRequest>> {
    return this.getPaged('', page, size)
  }

  getBookingRequest(id: number): Observable<BookingRequest> {
    return this.get('' + id)
  }

  createBookingRequest(request: BookingRequestChangeRequest): Observable<BookingRequest> {
    return this.post('', request)
  }

  updateBookingRequest(id: number, request: BookingRequestChangeRequest): Observable<BookingRequest> {
    return this.put('' + id, request)
  }

  deleteBookingRequest(id: number): Observable<BookingRequest> {
    return this.delete('' + id)
  }

  getAllBookingRequestInfoUnconfirmed(page: number, size: number): Observable<Page<BookingRequestInfo>> {
    return this.getPaged('unconfirmed/info', page, size)
  }

  filterAllBookingRequestInfoUnconfirmed(filter: BookingRequestFilterRequest, page: number, size: number): Observable<Page<BookingRequestInfo>> {
    return this.postPaged('unconfirmed/info', filter, page, size)
  }

  getConfirmationMessage(id: number, bookingId: number): Observable<ResolvedResponse> {
    return this.get('' + id + '/confirm/' + bookingId + '/message')
  }

  confirmBookingRequest(id: number, bookingId: number, content: BookingConfirmationContent): Observable<GenericRequestResult> {
    return this.put('' + id + '/confirm/' + bookingId, content)
  }

  getDenialMessage(id: number): Observable<ResolvedResponse> {
    return this.get('' + id + '/deny/message')
  }

  denyBookingRequest(id: number, content: BookingConfirmationContent): Observable<GenericRequestResult> {
    return this.put('' + id + '/deny', content)
  }

  getInfoByBookingId(bookingId: number): Observable<BookingRequestInfo> {
    return this.get('info/by/booking/' + bookingId)
  }

  changing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  confirmBooking(selectedBooking: BookingInfo, data: BookingRequestInfo): Observable<boolean> {
    let dialogRef = this.dialog.open(RequestProcessDialogComponent, {
      data: {info: data, selectedBooking: selectedBooking, confirmation: true},
      height: '800px',
      width: '800px',
    })

    return dialogRef.afterClosed().pipe(
      switchMap(result => {
        if (!result) {
          this.changing.next(false)
          return EMPTY
        }
        let content = result as BookingConfirmationContent
        this.changing.next(true)
        return this.confirmBookingRequest(data.id, selectedBooking.id, content)
      }),
      tap(result => this.handleBookingChangeResult(result, data)),
      map(result => result.success)
    )
  }

  denialBooking(selectedBooking: BookingInfo, data: BookingRequestInfo): Observable<boolean> {
    let dialogRef = this.dialog.open(RequestProcessDialogComponent, {
      data: {info: data, selectedBooking: selectedBooking, confirmation: false},
      height: '800px',
      width: '800px',
    })
    return dialogRef.afterClosed().pipe(
      switchMap(result => {
        if (!result) {
          this.changing.next(false)
          return EMPTY
        }
        let content = result as BookingConfirmationContent
        this.changing.next(true)
        return this.denyBookingRequest(data.id, content)
      }),
      tap(result => this.handleBookingChangeResult(result, data)),
      map(result => result.success)
    )
  }

  private handleBookingChangeResult(result: GenericRequestResult, data: BookingRequestInfo) {
    this.changing.next(false)
    if (result.success) {
      this.toastService.success(RequestChangeResultComponent, {data: {result: result, data: data}})
    } else {
      let message = this.translationService.instant(result.msg)
      this.toastService.error(message)
    }
  }

  updateBookingRequestVisitorGroup(data: BookingRequestInfo, request: VisitorGroupChangeRequest): Observable<GenericRequestResult> {
    return this.put('' + data.id + '/visitor', request)
  }

  setComment(id: number, comment: string): Observable<BookingRequest> {
    return this.patch(id + '/comment', {value: comment})
  }
}
