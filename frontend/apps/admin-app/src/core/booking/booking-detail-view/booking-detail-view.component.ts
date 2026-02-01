import {Component, computed, input, model, OnDestroy, OnInit, output, resource, signal, untracked} from '@angular/core';
import {
  BookingStatusComponent,
  GenericRequestResult,
  toPromise,
  VerificationStatusComponent,
  VisitorTypeComponent
} from "@open-booking/shared";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {
  BookingChangeRequest,
  BookingConfirmationContent,
  BookingDetails,
  OfferReference,
  VerificationStatus
} from "@open-booking/core";
import {VisitorTitleComponent} from "../../visitor/visitor-title/visitor-title.component";
import {VisitorSizeComponent} from "../../visitor/visitor-size/visitor-size.component";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {MatDivider} from "@angular/material/list";
import {DatePipe} from "@angular/common";
import {OfferReferenceComponent} from "../../offer/offer-reference/offer-reference.component";
import {BookingService} from "@open-booking/admin";
import {MatDialog} from "@angular/material/dialog";
import {BookingProcessDialogComponent} from "../booking-process-dialog/booking-process-dialog.component";
import {EMPTY, interval, of, Subject, switchMap, takeUntil, tap} from "rxjs";
import {VisitorChangeDialogComponent} from "../../visitor/visitor-change-dialog/visitor-change-dialog.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {BookingOfferChangeDialogComponent} from "../booking-offer-change-dialog/booking-offer-change-dialog.component";
import {VisitorConfirmComponent} from "../../visitor/visitor-confirm/visitor-confirm.component";
import {EditorInfoComponent} from "../../editor/editor-info/editor-info.component";
import {HotToastService} from "@ngxpert/hot-toast";


@Component({
  selector: 'app-booking-detail-view',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    BookingStatusComponent,
    VerificationStatusComponent,
    VisitorTypeComponent,
    VisitorTitleComponent,
    VisitorSizeComponent,
    TranslatePipe,
    MatDivider,
    DatePipe,
    OfferReferenceComponent,
    MatProgressSpinner,
    VisitorConfirmComponent,
    EditorInfoComponent,
  ],
  templateUrl: './booking-detail-view.component.html',
  styleUrl: './booking-detail-view.component.scss',
})
export class BookingDetailViewComponent implements OnInit, OnDestroy {

  data = input.required<BookingDetails>()
  showBackButton = input(false)
  editMode = model(false)
  reloading = input.required()

  reload = output<boolean>()
  close = output<boolean>()
  back = output<boolean>()

  created = computed(() => this.data().booking.created + 'Z')
  updated = computed(() => this.data().booking.updated + 'Z')

  updating = signal(false)

  private editorCriteria = computed(() => ({
    editMode: this.editMode(),
    bookingId: this.data().booking.id
  }))

  private editorResource = resource({
    params: this.editorCriteria,
    loader: param => toPromise(
      (param.params.editMode)
        ? this.service.createEditor(param.params.bookingId)
        : of(null),
      param.abortSignal
    )
  })

  editor = computed(() => this.editorResource.value())
  private unsub = new Subject<void>()

  constructor(private service: BookingService, private translate: TranslateService, private toast: HotToastService, private dialog: MatDialog) {

  }

  ngOnInit() {
    interval(60000).pipe(
      takeUntil(this.unsub),
    ).subscribe(value => this.refreshEditor())
  }

  ngOnDestroy() {
    this.unsub.next()
    this.unsub.complete()

    const editor = untracked(() => this.editor())
    const bookingId = untracked(() => this.data()?.booking?.id)


    if (editor) {
      this.service.deleteEditor(editor.resourceId).subscribe()
    } else if (bookingId) {
      this.service.deleteEditor(bookingId).subscribe()
    }
  }


  private refreshEditor() {
    let editor = this.editor()
    if (editor) this.editorResource.reload()
  }

  protected onConfirm(offer: OfferReference) {
    this.updating.set(true)
    let dialogRef = this.dialog.open(BookingProcessDialogComponent, {
      data: {info: this.data(), offer: offer, confirmation: true},
      height: '800px',
      width: '800px',
    })

    dialogRef.afterClosed().pipe(
      switchMap(result => {
        if (!result) {
          this.updating.set(false)
          return EMPTY
        }
        let content = result as BookingConfirmationContent
        return this.service.confirmBooking(this.data().booking.id, content)
      })
    ).subscribe(() => this.handleUpdateCompleted())
  }

  protected onDecline(offer: OfferReference) {
    this.updating.set(true)
    let dialogRef = this.dialog.open(BookingProcessDialogComponent, {
      data: {info: this.data(), confirmation: false},
      height: '800px',
      width: '800px',
    })

    dialogRef.afterClosed().pipe(
      switchMap(result => {
        if (!result) {
          this.updating.set(false)
          return EMPTY
        }
        let content = result as BookingConfirmationContent
        return this.service.declineBooking(this.data().booking.id, content)
      }),
      tap(value => this.handleGenericRequestResult(value))
    ).subscribe(() => this.handleUpdateCompleted())
  }

  protected onEditVisitor() {
    let reference = this.dialog.open(VisitorChangeDialogComponent, {
      data: this.data().visitor,
      disableClose: true
    })
    reference.afterClosed().subscribe(result => {
      if (result) {
        this.updating.set(true)
        let current = this.data().booking
        let request = new BookingChangeRequest(result, current.comment, current.lang, current.offerId, true, true, false)
        this.service.updateBooking(current.id, request).subscribe(() => this.handleUpdateCompleted())
      }
    })
  }

  protected onChangeOffer() {

    let reference = this.dialog.open(BookingOfferChangeDialogComponent, {
      data: this.data(),
      disableClose: true
    })
    reference.afterClosed().subscribe(result => {
      if (result) {
        this.updating.set(true)
        let current = this.data().booking
        let request = new BookingChangeRequest(result, current.comment, current.lang, current.offerId, true, true, false)
        this.service.updateBooking(current.id, request).subscribe(() => this.handleUpdateCompleted())
      }
    })
  }

  private handleUpdateCompleted() {
    this.updating.set(false)
    this.reload.emit(true)
  }

  protected readonly VerificationStatus = VerificationStatus;


  protected onEditMode() {
    this.editMode.set(true)
  }

  private handleGenericRequestResult(value: GenericRequestResult) {
    if (value.success) {
      this.translate.get(value.msg).subscribe(value => this.toast.success(value))
    } else {
      this.translate.get(value.msg).subscribe(value => this.toast.error(value))
    }
  }
}
