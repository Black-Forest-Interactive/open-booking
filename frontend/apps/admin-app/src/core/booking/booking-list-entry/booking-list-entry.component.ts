import {Component, computed, input, output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {BookingDetails, VisitorType} from "@open-booking/core";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {BookingStatusComponent, VisitorTypeComponent} from "@open-booking/shared";
import {VisitorSizeComponent} from "../../visitor/visitor-size/visitor-size.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-booking-list-entry',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    BookingStatusComponent,
    VisitorTypeComponent,
    VisitorSizeComponent,
    NgClass
  ],
  templateUrl: './booking-list-entry.component.html',
  styleUrl: './booking-list-entry.component.scss',
})
export class BookingListEntryComponent {
  data = input.required<BookingDetails>()
  showText = input(false)
  showContact = input(true)
  isSelected = input(false)

  showDetails = output<BookingDetails>()

  visitor = computed(() => this.data().visitor)
  name = computed(() => this.visitor().type === VisitorType.GROUP ? this.visitor().title : this.visitor().name)
  contact = computed(() => this.visitor().type === VisitorType.GROUP ? this.visitor().name : undefined)
  comment = computed(() => this.data().booking.comment)
  email = computed(() => this.visitor().email)
  phone = computed(() => this.visitor().phone)

  id = computed(() => this.data().booking.id)
  status = computed(() => this.data().booking.status)


  constructor(private dialog: MatDialog) {
  }


  // protected showDetails() {
  //   this.dialog.open(ReservationDetailsDialogComponent, {
  //     disableClose: true,
  //     data: this.id(),
  //     width: 'auto',
  //     maxWidth: 'none',
  //   })
  // }
  //
  // protected showCommentDialog(): void {
  //   this.dialog.open(BookingCommentDialogComponent, {
  //     data: {comment: this.comment()},
  //     width: '500px',
  //     panelClass: 'comment-dialog'
  //   });
  // }
}
