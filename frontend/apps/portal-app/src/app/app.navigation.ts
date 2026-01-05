import {Router} from "@angular/router";

export function navigateToDashboard(router: Router) {
  router.navigate(['']).then()
}

export function navigateToReservation(router: Router) {
  router.navigate(['reservation']).then()
}
