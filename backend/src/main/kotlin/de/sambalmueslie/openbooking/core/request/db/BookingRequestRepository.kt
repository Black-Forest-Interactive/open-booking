package de.sambalmueslie.openbooking.core.request.db

import de.sambalmueslie.openbooking.core.request.api.BookingRequestStatus
import de.sambalmueslie.openbooking.core.visitor.api.VerificationStatus
import io.micronaut.data.annotation.Query
import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository
import java.time.LocalDate

@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
@Deprecated("use reservation instead.", ReplaceWith("reservation"))
interface BookingRequestRepository : PageableRepository<BookingRequestData, Long> {

    @Query(
        value = """
            SELECT br.*
            FROM booking_request br
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE br.status IN (:status) 
            ORDER BY CASE vg.status 
                    WHEN 'CONFIRMED' then 0
                    WHEN 'UNCONFIRMED' then 1
                    WHEN 'UNKNOWN' then 2
                END,
                br.created ASC
                
        """,
        countQuery = """
            SELECT COUNT(br.*)
            FROM booking_request br
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE br.status IN (:status)
        """,
        nativeQuery = true
    )
    fun findByStatusIn(status: List<BookingRequestStatus>, pageable: Pageable): Page<BookingRequestData>

    fun findOneByKey(key: String): BookingRequestData?

    @Query(
        value = """
            SELECT br.*
            FROM booking_request br
                     INNER JOIN booking_request_booking rel ON br.id = rel.booking_id
                     INNER JOIN booking b ON rel.booking_id = b.id
                     INNER JOIN offer o ON o.id = b.offer_id
            WHERE o.start::date = :offerDate and br.status IN (:status)
        """,
        countQuery = """
            SELECT COUNT(br.*)
            FROM booking_request br
                     INNER JOIN booking_request_booking rel ON br.id = rel.booking_id
                     INNER JOIN booking b ON rel.booking_id = b.id
                     INNER JOIN offer o ON o.id = b.offer_id
            WHERE o.start::date = :offerDate and br.status IN (:status)
        """,
        nativeQuery = true
    )
    fun findByOfferDate(offerDate: LocalDate, status: List<BookingRequestStatus>, pageable: Pageable): Page<BookingRequestData>

    @Query(
        value = """
            SELECT br.*
            FROM booking_request br
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE vg.status = :visitorStatus and br.status IN (:status)
        """,
        countQuery = """
            SELECT COUNT(br.*)
            FROM booking_request br
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE vg.status = :visitorStatus and br.status IN (:status)
        """,
        nativeQuery = true
    )
    fun findByVisitorStatus(visitorStatus: VerificationStatus, status: List<BookingRequestStatus>, pageable: Pageable): Page<BookingRequestData>

    @Query(
        value = """
            SELECT br.*
            FROM booking_request br
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE ((vg.title ILIKE :query) OR (vg.contact ILIKE  :query)) and br.status IN (:status)
        """,
        countQuery = """
            SELECT COUNT(br.*)
            FROM booking_request br
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE ((vg.title ILIKE :query) OR (vg.contact ILIKE  :query)) and br.status IN (:status)
        """,
        nativeQuery = true
    )
    fun findByQuery(query: String, status: List<BookingRequestStatus>, pageable: Pageable): Page<BookingRequestData>

    @Query(
        value = """
            SELECT br.*
            FROM booking_request br
                     INNER JOIN booking_request_booking rel ON br.id = rel.booking_id
                     INNER JOIN booking b ON rel.booking_id = b.id
                     INNER JOIN offer o ON o.id = b.offer_id
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE vg.status = :visitorStatus and o.start::date = :offerDate and br.status IN (:status)
        """,
        countQuery = """
            SELECT COUNT(br.*)
            FROM booking_request br
                     INNER JOIN booking_request_booking rel ON br.id = rel.booking_id
                     INNER JOIN booking b ON rel.booking_id = b.id
                     INNER JOIN offer o ON o.id = b.offer_id
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE vg.status = :visitorStatus and o.start::date = :offerDate and br.status IN (:status)
        """,
        nativeQuery = true
    )
    fun findByOfferDateAndVisitorStatus(offerDate: LocalDate, visitorStatus: VerificationStatus, status: List<BookingRequestStatus>, pageable: Pageable): Page<BookingRequestData>

    @Query(
        value = """
            SELECT br.*
            FROM booking_request br
                     INNER JOIN booking_request_booking rel ON br.id = rel.booking_id
                     INNER JOIN booking b ON rel.booking_id = b.id
                     INNER JOIN offer o ON o.id = b.offer_id
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE ((vg.title ILIKE :query) OR (vg.contact ILIKE  :query)) and o.start::date = :offerDate and br.status IN (:status)
        """,
        countQuery = """
            SELECT COUNT(br.*)
            FROM booking_request br
                     INNER JOIN booking_request_booking rel ON br.id = rel.booking_id
                     INNER JOIN booking b ON rel.booking_id = b.id
                     INNER JOIN offer o ON o.id = b.offer_id
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE ((vg.title ILIKE :query) OR (vg.contact ILIKE  :query)) and o.start::date = :offerDate and br.status IN (:status)
        """,
        nativeQuery = true
    )
    fun findByOfferDateAndQuery(offerDate: LocalDate, query: String, status: List<BookingRequestStatus>, pageable: Pageable): Page<BookingRequestData>


    @Query(
        value = """
            SELECT br.*
            FROM booking_request br
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE vg.status = :visitorStatus and ((vg.title ILIKE :query) OR (vg.contact ILIKE  :query)) and br.status IN (:status)
        """,
        countQuery = """
            SELECT COUNT(br.*)
            FROM booking_request br
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE vg.status = :visitorStatus and ((vg.title ILIKE :query) OR (vg.contact ILIKE  :query)) and br.status IN (:status)
        """,
        nativeQuery = true
    )
    fun findByVisitorStatusAndQuery(visitorStatus: VerificationStatus, query: String, status: List<BookingRequestStatus>, pageable: Pageable): Page<BookingRequestData>


    @Query(
        value = """
            SELECT br.*
            FROM booking_request br
                     INNER JOIN booking_request_booking rel ON br.id = rel.booking_id
                     INNER JOIN booking b ON rel.booking_id = b.id
                     INNER JOIN offer o ON o.id = b.offer_id
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE vg.status = :visitorStatus and ((vg.title ILIKE :query) OR (vg.contact ILIKE  :query)) and o.start::date = :offerDate and br.status IN (:status)
        """,
        countQuery = """
            SELECT COUNT(br.*)
            FROM booking_request br
                     INNER JOIN booking_request_booking rel ON br.id = rel.booking_id
                     INNER JOIN booking b ON rel.booking_id = b.id
                     INNER JOIN offer o ON o.id = b.offer_id
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE vg.status = :visitorStatus and ((vg.title ILIKE :query) OR (vg.contact ILIKE  :query)) and o.start::date = :offerDate and br.status IN (:status)
        """,
        nativeQuery = true
    )
    fun findByOfferDateAndVisitorStatusAndQuery(
        offerDate: LocalDate,
        visitorStatus: VerificationStatus,
        query: String,
        status: List<BookingRequestStatus>,
        pageable: Pageable
    ): Page<BookingRequestData>

    fun findByIdIn(ids: Set<Long>): List<BookingRequestData>

}
