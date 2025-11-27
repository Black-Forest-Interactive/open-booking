package de.sambalmueslie.openbooking.backend.request.db

import de.sambalmueslie.openbooking.backend.group.api.VisitorGroupStatus
import de.sambalmueslie.openbooking.backend.request.api.BookingRequestStatus
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
            WHERE vg.status = :visitorGroupStatus and br.status IN (:status)
        """,
        countQuery = """
            SELECT COUNT(br.*)
            FROM booking_request br
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE vg.status = :visitorGroupStatus and br.status IN (:status)
        """,
        nativeQuery = true
    )
    fun findByVisitorGroupStatus(visitorGroupStatus: VisitorGroupStatus, status: List<BookingRequestStatus>, pageable: Pageable): Page<BookingRequestData>

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
            WHERE vg.status = :visitorGroupStatus and o.start::date = :offerDate and br.status IN (:status)
        """,
        countQuery = """
            SELECT COUNT(br.*)
            FROM booking_request br
                     INNER JOIN booking_request_booking rel ON br.id = rel.booking_id
                     INNER JOIN booking b ON rel.booking_id = b.id
                     INNER JOIN offer o ON o.id = b.offer_id
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE vg.status = :visitorGroupStatus and o.start::date = :offerDate and br.status IN (:status)
        """,
        nativeQuery = true
    )
    fun findByOfferDateAndVisitorGroupStatus(offerDate: LocalDate, visitorGroupStatus: VisitorGroupStatus, status: List<BookingRequestStatus>, pageable: Pageable): Page<BookingRequestData>

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
            WHERE vg.status = :visitorGroupStatus and ((vg.title ILIKE :query) OR (vg.contact ILIKE  :query)) and br.status IN (:status)
        """,
        countQuery = """
            SELECT COUNT(br.*)
            FROM booking_request br
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE vg.status = :visitorGroupStatus and ((vg.title ILIKE :query) OR (vg.contact ILIKE  :query)) and br.status IN (:status)
        """,
        nativeQuery = true
    )
    fun findByVisitorGroupStatusAndQuery(visitorGroupStatus: VisitorGroupStatus, query: String, status: List<BookingRequestStatus>, pageable: Pageable): Page<BookingRequestData>


    @Query(
        value = """
            SELECT br.*
            FROM booking_request br
                     INNER JOIN booking_request_booking rel ON br.id = rel.booking_id
                     INNER JOIN booking b ON rel.booking_id = b.id
                     INNER JOIN offer o ON o.id = b.offer_id
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE vg.status = :visitorGroupStatus and ((vg.title ILIKE :query) OR (vg.contact ILIKE  :query)) and o.start::date = :offerDate and br.status IN (:status)
        """,
        countQuery = """
            SELECT COUNT(br.*)
            FROM booking_request br
                     INNER JOIN booking_request_booking rel ON br.id = rel.booking_id
                     INNER JOIN booking b ON rel.booking_id = b.id
                     INNER JOIN offer o ON o.id = b.offer_id
                     INNER JOIN visitor_group vg on br.visitor_group_id = vg.id
            WHERE vg.status = :visitorGroupStatus and ((vg.title ILIKE :query) OR (vg.contact ILIKE  :query)) and o.start::date = :offerDate and br.status IN (:status)
        """,
        nativeQuery = true
    )
    fun findByOfferDateAndVisitorGroupStatusAndQuery(
        offerDate: LocalDate,
        visitorGroupStatus: VisitorGroupStatus,
        query: String,
        status: List<BookingRequestStatus>,
        pageable: Pageable
    ): Page<BookingRequestData>

    fun findByIdIn(ids: Set<Long>): List<BookingRequestData>

}
