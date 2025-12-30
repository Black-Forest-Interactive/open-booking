package de.sambalmueslie.openbooking.core.offer


import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.cache.CacheService
import de.sambalmueslie.openbooking.core.offer.api.*
import de.sambalmueslie.openbooking.core.offer.db.OfferData
import de.sambalmueslie.openbooking.core.offer.db.OfferRepository
import de.sambalmueslie.openbooking.core.offer.db.Queries
import de.sambalmueslie.openbooking.error.InvalidRequestException
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.repository.jpa.criteria.PredicateSpecification
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit


@Singleton
class OfferService(
    private val repository: OfferRepository,
    private val timeProvider: TimeProvider,
    cacheService: CacheService,
) : GenericCrudService<Long, Offer, OfferChangeRequest, OfferData>(repository, cacheService, Offer::class, logger) {


    companion object {
        private val logger = LoggerFactory.getLogger(OfferService::class.java)
        private const val MSG_OFFER_SERIES_FAIL = "REQUEST.OFFER.SERIES.FAIL"
        private const val MSG_OFFER_SERIES_SUCCESS = "REQUEST.OFFER.SERIES.SUCCESS"
        private const val MSG_OFFER_RANGE_FAIL = "REQUEST.OFFER.RANGE.FAIL"
        private const val MSG_OFFER_RANGE_SUCCESS = "REQUEST.OFFER.RANGE.SUCCESS"
    }

    override fun getAll(pageable: Pageable): Page<Offer> {
        return repository.findAllOrderByStart(pageable).map { it.convert() }
    }

    override fun createData(request: OfferChangeRequest): OfferData {
        return OfferData.create(request, timeProvider.now())
    }

    override fun existing(request: OfferChangeRequest): OfferData? {
        return repository.findOneByStart(request.start)
    }

    override fun updateData(data: OfferData, request: OfferChangeRequest): OfferData {
        return data.update(request, timeProvider.now())
    }

    override fun isValid(request: OfferChangeRequest) {
        if (request.maxPersons <= 0) throw InvalidRequestException("Max Person for offer cannot be below or equals 0")

    }


    fun getOffer(date: LocalDate): List<Offer> {
        val start = date.atStartOfDay()
        val finish = date.atTime(23, 59, 59)
        return repository.findByStartGreaterThanEqualsAndFinishLessThanEqualsOrderByStart(start, finish).map { it.convert() }
    }

    fun getOffer(offerIds: Set<Long>): List<Offer> {
        return repository.findByIdIn(offerIds).map { it.convert() }
    }

    fun getFirstOffer(): Offer? {
        return repository.findOneOrderByStart()?.convert()
    }

    fun getFirstOffer(date: LocalDate): Offer? {
        return repository.findOneByStartGreaterThanEqualsOrderByStart(date.atStartOfDay())?.convert()
    }

    fun getLastOffer(): Offer? {
        return repository.findOneOrderByStartDesc()?.convert()
    }

    fun getLastOffer(date: LocalDate): Offer? {
        return repository.findOneByStartGreaterThanEqualsOrderByStartDesc(date.atStartOfDay())?.convert()
    }

    fun setActive(id: Long, value: Boolean) = patchData(id) { it.active = value }

    fun setMaxPersons(id: Long, value: Int) = patchData(id) { if (value >= 0) it.maxPersons = value }
    fun createSeries(request: OfferSeriesRequest): GenericRequestResult {
        if (!request.duration.isPositive) return GenericRequestResult(false, MSG_OFFER_SERIES_FAIL)
        if (!request.interval.isPositive) return GenericRequestResult(false, MSG_OFFER_SERIES_FAIL)
        if (request.quantity <= 0) return GenericRequestResult(false, MSG_OFFER_SERIES_FAIL)

        var start = request.start
        (0 until request.quantity).forEach { _ ->
            val finish = start.plus(request.duration)
            val finishTime = finish.toLocalTime()
            if (finishTime.isAfter(request.maxTime)) {
                start = start.with(request.minTime).plusDays(1)
                create(OfferChangeRequest(start, start.plus(request.duration), request.maxPersons, true))
            } else {
                create(OfferChangeRequest(start, finish, request.maxPersons, true))
            }

            start = start.plus(request.interval)
            val startTime = start.toLocalTime()
            if (startTime.isAfter(request.maxTime)) {
                start = start.with(request.minTime).plusDays(1)
            }
        }
        return GenericRequestResult(true, MSG_OFFER_SERIES_SUCCESS)
    }

    fun createRange(request: OfferRangeRequest): GenericRequestResult {
        if (!request.duration.isPositive) return GenericRequestResult(false, MSG_OFFER_RANGE_FAIL)
        if (!request.interval.isPositive) return GenericRequestResult(false, MSG_OFFER_RANGE_FAIL)
        if (request.dateTo.isBefore(request.dateFrom)) return GenericRequestResult(false, MSG_OFFER_RANGE_FAIL)
        if (request.timeTo.isBefore(request.timeFrom)) return GenericRequestResult(false, MSG_OFFER_RANGE_FAIL)

        var date = request.dateFrom
        val days = ChronoUnit.DAYS.between(request.dateFrom, request.dateTo)

        (0..days).forEach {
            var startTime = request.timeFrom
            var finishTime = startTime.plus(request.duration)
            while (!finishTime.isAfter(request.timeTo)) {
                val start = LocalDateTime.of(date, startTime)
                val finish = LocalDateTime.of(date, finishTime)
                create(OfferChangeRequest(start, finish, request.maxPersons, true))

                startTime = startTime.plus(request.interval)
                finishTime = startTime.plus(request.duration)
            }

            date = date.plusDays(1)
        }
        return GenericRequestResult(true, MSG_OFFER_RANGE_SUCCESS)
    }

    fun filter(request: OfferFilterRequest, pageable: Pageable): Page<Offer> {
        val from: LocalDate? = request.from
        val to: LocalDate? = request.to
        val active: Boolean? = request.active

        if (from != null && to != null && active == null) {
            return repository.findAllByStartGreaterThanEqualsAndFinishLessThanOrderByStart(from.atStartOfDay(), to.atStartOfDay().plusDays(1), pageable).map { it.convert() }
        }

        val predicates = mutableListOf<PredicateSpecification<OfferData>>()
        if (active != null) predicates.add(Queries.active(active))
        if (from != null) predicates.add(Queries.from(from))
        if (to != null) predicates.add(Queries.to(to))

        if (predicates.isEmpty()) return repository.findAllOrderByStart(pageable).map { it.convert() }

        val spec: PredicateSpecification<OfferData> = PredicateSpecification.where(
            predicates.reduce { acc, spec -> acc.and(spec) }
        )
        return repository.findAll(spec, pageable).map { it.convert() }
    }


}
