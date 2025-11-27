package de.sambalmueslie.openbooking.frontend.admin


import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.frontend.admin.api.AdminAPI.Companion.PERMISSION_ADMIN_SETUP_OFFER
import de.sambalmueslie.openbooking.frontend.admin.api.OfferSetupRequest
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.security.authentication.Authentication

@Controller("/api/frontend/admin")
class AdminController(private val service: AdminService) {
    @Post("/setup/offer")
    fun setupOffer(auth: Authentication, @Body request: OfferSetupRequest) = auth.checkPermission(PERMISSION_ADMIN_SETUP_OFFER) { service.setup(request) }
}
