package de.sambalmueslie.openbooking.backend.request

import de.sambalmueslie.openbooking.backend.booking.BookingService
import de.sambalmueslie.openbooking.backend.booking.api.BookingInfo
import de.sambalmueslie.openbooking.backend.booking.api.BookingStatus
import de.sambalmueslie.openbooking.backend.group.VisitorGroupService
import de.sambalmueslie.openbooking.backend.group.api.Address
import de.sambalmueslie.openbooking.backend.group.api.VisitorGroup
import de.sambalmueslie.openbooking.backend.group.api.VisitorGroupChangeRequest
import de.sambalmueslie.openbooking.backend.mail.external.MailClient
import de.sambalmueslie.openbooking.backend.offer.OfferService
import de.sambalmueslie.openbooking.backend.offer.api.OfferChangeRequest
import de.sambalmueslie.openbooking.backend.request.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.backend.request.api.BookingRequestChangeRequest
import de.sambalmueslie.openbooking.backend.request.api.BookingRequestStatus
import io.micronaut.test.annotation.MockBean
import io.micronaut.test.extensions.junit5.annotation.MicronautTest
import io.mockk.mockk
import jakarta.inject.Inject
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import java.time.LocalDateTime

@MicronautTest
class BookingRequestChangeServiceTest {

    @Inject
    lateinit var service: BookingRequestChangeService

    @Inject
    lateinit var requestService: BookingRequestService

    @Inject
    lateinit var bookingService: BookingService

    @Inject
    lateinit var visitorGroupService: VisitorGroupService

    @Inject
    lateinit var offerService: OfferService

    val mailClient = mockk<MailClient>()

    @MockBean(MailClient::class)
    fun mailClient(): MailClient {
        return mailClient
    }

    @AfterEach
    fun cleanup() {
        requestService.deleteAll()
        bookingService.deleteAll()
        visitorGroupService.deleteAll()
        offerService.deleteAll()
    }

    @Test
    fun singleBookingChangeVisitorGroupData() {
        val offer = offerService.create(OfferChangeRequest(LocalDateTime.parse("2023-02-04T08:00:00"), LocalDateTime.parse("2023-02-04T08:50:00"), 25, true))

        val visitorRequest = VisitorGroupChangeRequest("title", 20, false, 5, 10, "contact", Address("street", "city", "zip"), "phone", "email")
        val request = requestService.create(BookingRequestChangeRequest(visitorRequest, listOf(offer.id), "comment", false, false))
        assertEquals(BookingRequestStatus.UNCONFIRMED, request.status)

        var info = requestService.info(request.id)
        assertNotNull(info)

        requestService.confirm(request.id, info!!.bookings.first().id, BookingConfirmationContent("", "", true))

        val visitorChangeRequest = VisitorGroupChangeRequest("title-change", 20, true, 15, 20, "contact-change", Address("street-change", "city-change", "zip-change"), "phone-change", "email-change")
        val result = service.updateVisitorGroup(request.id, visitorChangeRequest)
        assertEquals(true, result.success)


        info = requestService.info(request.id)
        assertNotNull(info)

        val visitorGroup = info!!.visitorGroup
        assertEquals(
            VisitorGroup(
                visitorGroup.id,
                visitorChangeRequest.title,
                visitorChangeRequest.size,
                visitorChangeRequest.isGroup,
                visitorChangeRequest.minAge,
                visitorChangeRequest.maxAge,
                visitorChangeRequest.contact,
                visitorChangeRequest.address,
                visitorChangeRequest.phone,
                visitorChangeRequest.email,
                visitorGroup.status
            ), visitorGroup
        )

        assertEquals(1, info.bookings.size)

        val booking = info.bookings.first()
        assertEquals(
            BookingInfo(booking.id, offer, offer.maxPersons - visitorChangeRequest.size, visitorChangeRequest.size, BookingStatus.CONFIRMED, booking.timestamp),
            booking
        )

    }

    @Test
    fun singleBookingChangeVisitorGroupReduceSize() {
        val offer = offerService.create(OfferChangeRequest(LocalDateTime.parse("2023-02-04T09:00:00"), LocalDateTime.parse("2023-02-04T09:50:00"), 25, true))

        val visitorRequest = VisitorGroupChangeRequest("title", 20, false, 5, 10, "contact", Address("street", "city", "zip"), "phone", "email")
        val request = requestService.create(BookingRequestChangeRequest(visitorRequest, listOf(offer.id), "comment", false, false))
        assertEquals(BookingRequestStatus.UNCONFIRMED, request.status)

        var info = requestService.info(request.id)
        assertNotNull(info)

        requestService.confirm(request.id, info!!.bookings.first().id, BookingConfirmationContent("", "", true))

        val visitorChangeRequest = VisitorGroupChangeRequest("title", 10, false, 5, 10, "contact", Address("street", "city", "zip"), "phone", "email")
        val result = service.updateVisitorGroup(request.id, visitorChangeRequest)
        assertEquals(true, result.success)


        info = requestService.info(request.id)
        assertNotNull(info)

        val visitorGroup = info!!.visitorGroup
        assertEquals(
            VisitorGroup(
                visitorGroup.id,
                visitorChangeRequest.title,
                visitorChangeRequest.size,
                visitorChangeRequest.isGroup,
                visitorChangeRequest.minAge,
                visitorChangeRequest.maxAge,
                visitorChangeRequest.contact,
                visitorChangeRequest.address,
                visitorChangeRequest.phone,
                visitorChangeRequest.email,
                visitorGroup.status
            ), visitorGroup
        )

        assertEquals(1, info.bookings.size)

        val booking = info.bookings.first()
        assertEquals(
            BookingInfo(booking.id, offer, offer.maxPersons - visitorChangeRequest.size, visitorChangeRequest.size, BookingStatus.CONFIRMED, booking.timestamp),
            booking
        )

    }

    @Test
    fun singleBookingChangeVisitorGroupIncreaseSize() {
        val offer = offerService.create(OfferChangeRequest(LocalDateTime.parse("2023-02-04T10:00:00"), LocalDateTime.parse("2023-02-04T10:50:00"), 25, true))

        val visitorRequest = VisitorGroupChangeRequest("title", 20, false, 5, 10, "contact", Address("street", "city", "zip"), "phone", "email")
        val request = requestService.create(BookingRequestChangeRequest(visitorRequest, listOf(offer.id), "comment", false, false))
        assertEquals(BookingRequestStatus.UNCONFIRMED, request.status)

        var info = requestService.info(request.id)
        assertNotNull(info)

        requestService.confirm(request.id, info!!.bookings.first().id, BookingConfirmationContent("", "", true))

        val visitorChangeRequest = VisitorGroupChangeRequest("title", 25, false, 5, 10, "contact", Address("street", "city", "zip"), "phone", "email")
        val result = service.updateVisitorGroup(request.id, visitorChangeRequest)
        assertEquals(true, result.success)


        info = requestService.info(request.id)
        assertNotNull(info)

        val visitorGroup = info!!.visitorGroup
        assertEquals(
            VisitorGroup(
                visitorGroup.id,
                visitorChangeRequest.title,
                visitorChangeRequest.size,
                visitorChangeRequest.isGroup,
                visitorChangeRequest.minAge,
                visitorChangeRequest.maxAge,
                visitorChangeRequest.contact,
                visitorChangeRequest.address,
                visitorChangeRequest.phone,
                visitorChangeRequest.email,
                visitorGroup.status
            ), visitorGroup
        )

        assertEquals(1, info.bookings.size)

        val booking = info.bookings.first()
        assertEquals(
            BookingInfo(booking.id, offer, offer.maxPersons - visitorChangeRequest.size, visitorChangeRequest.size, BookingStatus.CONFIRMED, booking.timestamp),
            booking
        )
    }

}
