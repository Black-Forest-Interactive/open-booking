import {Component, computed, input, OnDestroy, OnInit, output, resource, signal} from '@angular/core';
import {
  BookingStatusComponent,
  toPromise,
  VerificationStatusComponent,
  VisitorTypeComponent
} from "@open-booking/shared";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {BookingConfirmationContent, BookingDetails, OfferReference} from "@open-booking/core";
import {VisitorTitleComponent} from "../../visitor/visitor-title/visitor-title.component";
import {VisitorSizeComponent} from "../../visitor/visitor-size/visitor-size.component";
import {TranslatePipe} from "@ngx-translate/core";
import {MatDivider} from "@angular/material/list";
import {DatePipe} from "@angular/common";
import {OfferReferenceComponent} from "../../offer/offer-reference/offer-reference.component";
import {BookingService} from "@open-booking/admin";
import {MatDialog} from "@angular/material/dialog";
import {BookingProcessDialogComponent} from "../booking-process-dialog/booking-process-dialog.component";
import {EMPTY, interval, of, Subject, switchMap, takeUntil} from "rxjs";

@Component({
  selector: 'app-booking-details',
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
  ],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.scss',
})
export class BookingDetailsComponent implements OnInit, OnDestroy {

  data = input.required<BookingDetails>()
  showBackButton = input(false)
  editMode = input(false)
  reloading = input.required()

  reload = output<boolean>()
  close = output<boolean>()
  back = output<boolean>()

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
        : of(),
      param.abortSignal
    )
  })

  editor = computed(() => this.editorResource.value())
  private unsub = new Subject<void>()

  constructor(private service: BookingService, private dialog: MatDialog) {

  }

  ngOnInit() {
    interval(60000).pipe(
      takeUntil(this.unsub),
    ).subscribe(value => this.refreshEditor())
  }

  ngOnDestroy() {
    this.unsub.next()
    this.unsub.complete()

    let editor = this.editor()
    if (editor) {
      this.service.deleteEditor(editor.resourceId).subscribe()
    } else {
      let resourceId = this.data().booking.id
      if (resourceId) this.service.deleteEditor(resourceId).subscribe()
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
    ).subscribe({
      complete: () => {
        this.updating.set(false)
        this.reload.emit(true)
      }
    })
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
      })
    ).subscribe({
      complete: () => {
        this.updating.set(false)
        this.reload.emit(true)
      }
    })
  }
}
