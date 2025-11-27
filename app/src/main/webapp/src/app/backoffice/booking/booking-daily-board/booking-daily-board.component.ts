import {Component, EventEmitter} from '@angular/core';
import {Offer} from "../../offer/model/offer-api";
import {ActivatedRoute} from "@angular/router";
import {OfferService} from "../../offer/model/offer.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-booking-daily-board',
  templateUrl: './booking-daily-board.component.html',
  styleUrls: ['./booking-daily-board.component.scss']
})
export class BookingDailyBoardComponent {
  reloading: boolean = false
  offer: Offer[] = []

  date: string = ""
  keyUp: EventEmitter<string> = new EventEmitter<string>()
  constructor(
    private route: ActivatedRoute,
    private service: OfferService,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(value => {
        let date = value.get('date')
        if (date) {
          this.date = date
          this.reloading = true
          this.service.findOfferByDate(date).subscribe(d => this.handleOffer(d))
        }
      }
    )
  }

  private handleOffer(d: Offer[]) {
    this.offer = d
    this.reloading = false
  }

  back() {
    this.location.back()
  }
}
