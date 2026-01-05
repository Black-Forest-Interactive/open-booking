import {Component, Input} from '@angular/core';
import {defaultOffer, Offer} from "../../offer/model/offer-api";
import {Booking, BookingDetails} from "../model/booking-api";
import {BookingService} from "../model/booking.service";
import {VisitorGroup} from "../../../visitor-group/model/visitor-group-api";
import {Router} from '@angular/router';

@Component({
  selector: 'app-booking-daily-board-offer',
  templateUrl: './booking-daily-board-offer.component.html',
  styleUrls: ['./booking-daily-board-offer.component.scss']
})
export class BookingDailyBoardOfferComponent {
  reloading: boolean = false
  @Input() offer: Offer = defaultOffer
  bookings: BookingDetails[] = []
  data: BookingDetailsEntry[] = []

  constructor(private service: BookingService, private router: Router) {
  }

  ngOnInit() {
    if (this.offer) {
      this.reloading = true
      this.service.findBookingDetailsByOffer(this.offer.id).subscribe(d => this.handleData(d))
    }
  }

  private handleData(d: BookingDetails[]) {
    this.bookings = d
    this.data = d.map(b => {
      return {booking: b.booking, visitor: b.visitor, width: this.getWidth(b)}
    })
    this.reloading = false
  }

  showDetails(b: BookingDetails) {
    this.router.navigate(["/backoffice/booking/details/" + b.booking.id]).then()
  }

  private getWidth(b: BookingDetails): number {
    let totalSize = this.offer.maxPersons
    return Math.abs(b.visitor.size / totalSize * 12)
  }

}

export interface BookingDetailsEntry {
  booking: Booking,
  visitor: VisitorGroup,
  width: number

}
