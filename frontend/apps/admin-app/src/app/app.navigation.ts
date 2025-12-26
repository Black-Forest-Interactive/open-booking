import {Router} from "@angular/router";

export function navigateToDashboard(router: Router) {
  router.navigate(['dashboard']).then()
}

export function navigateToOffer(router: Router) {
  router.navigate(['offer']).then()
}

export function navigateToBooking(router: Router) {
  router.navigate(['booking']).then()
}

export function navigateToRequest(router: Router) {
  router.navigate(['request']).then()
}

export function navigateToSearch(router: Router) {
  router.navigate(['search']).then()
}

export function navigateToResponse(router: Router) {
  router.navigate(['response']).then()
}

export function navigateToNotification(router: Router) {
  router.navigate(['notification']).then()
}

export function navigateToAudit(router: Router) {
  router.navigate(['audit']).then()
}

export function navigateToCache(router: Router) {
  router.navigate(['cache']).then()
}

export function navigateToSettings(router: Router) {
  router.navigate(['settings']).then()
}

export function navigateToMail(router: Router) {
  router.navigate(['mail']).then()
}

export function navigateToGroup(router: Router) {
  router.navigate(['group']).then()
}

export function navigateToStaff(router: Router) {
  router.navigate(['staff']).then()
}
