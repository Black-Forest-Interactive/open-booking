import {Router} from "@angular/router";

export function navigateToDashboard(router: Router) {
  router.navigate(['']).then()
}

export function navigateToBooking(router: Router) {
  router.navigate(['booking']).then()
}

export function navigateToBookingCheckout(router: Router) {
  router.navigate(['booking', 'checkout']).then()
}
