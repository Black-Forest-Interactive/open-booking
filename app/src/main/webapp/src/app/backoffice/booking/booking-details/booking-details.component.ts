import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {HotToastService} from "@ngneat/hot-toast";
import {BookingRequestService} from "../../request/model/booking-request.service";
import {BookingRequestInfo, defaultBookingRequestInfo} from "../../request/model/booking-request-api";

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent {
  reloading: boolean = false

  data: BookingRequestInfo = defaultBookingRequestInfo

  bookingId: number | undefined

  constructor(
    private service: BookingRequestService,
    private toastService: HotToastService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    if (id != null) {
      this.bookingId = +id
      this.reload()
    }
  }

  back() {
    this.location.back()
  }

  reload() {
    if (!this.bookingId) return
    if (this.reloading) return
    this.reloading = true
    this.service.getInfoByBookingId(this.bookingId).subscribe(data => this.handleData(data))
  }

  private handleData(data: BookingRequestInfo) {
    this.data = data
    this.reloading = false
  }
}
