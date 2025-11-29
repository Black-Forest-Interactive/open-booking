package de.sambalmueslie.openbooking.backend.booking.api

import de.sambalmueslie.openbooking.common.AuthCrudAPI
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication

interface BookingAPI : AuthCrudAPI<Long, Booking, BookingChangeRequest> {
    companion object {
        const val PERMISSION_READ = "openbooking.booking.read"
        const val PERMISSION_WRITE = "openbooking.booking.write"
    }

    fun findByOffer(auth: Authentication, offerId: Long): List<Booking>

    fun findDetailsByOffer(auth: Authentication, offerId: Long): List<BookingDetails>

    fun searchDetails(auth: Authentication, request: BookingSearchRequest, pageable: Pageable): Page<BookingSearchResult>
}
