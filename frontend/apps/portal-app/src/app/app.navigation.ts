import {Router} from "@angular/router";

export function navigateToDashboard(router: Router) {
  router.navigate(['']).then()
}

export function navigateToBooking(router: Router) {
  router.navigate(['booking']).then()
}
