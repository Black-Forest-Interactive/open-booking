package de.sambalmueslie.openbooking.core.offer


import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.guide.GuideService
import de.sambalmueslie.openbooking.core.label.LabelService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.offer.api.OfferChangeRequest
import de.sambalmueslie.openbooking.core.offer.db.OfferData
import de.sambalmueslie.openbooking.core.offer.db.OfferRepository
import de.sambalmueslie.openbooking.error.InvalidRequestException
import de.sambalmueslie.openbooking.infrastructure.cache.CacheService
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDate


@Singleton
class OfferService(
    private val repository: OfferRepository,

    private val labelService: LabelService,
    private val guideService: GuideService,

    private val timeProvider: TimeProvider,
    cacheService: CacheService,
) : GenericCrudService<Long, Offer, OfferChangeRequest, OfferChangeListener, OfferData>(repository, cacheService, Offer::class, logger) {


    companion object {
        private val logger = LoggerFactory.getLogger(OfferService::class.java)
    }

    override fun getAll(pageable: Pageable): Page<Offer> {
        return repository.findAllOrderByStart(pageable).map { it.convert() }
    }

    fun getByIds(ids: Set<Long>): List<Offer> {
        return repository.findByIdIn(ids).map { it.convert() }
    }

    fun getByDate(date: LocalDate): List<Offer> {
        return getDataByDate(date).map { it.convert() }
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


    private fun getDataByDate(date: LocalDate): List<OfferData> {
        val start = date.atStartOfDay()
        val finish = date.atTime(23, 59, 59)
        return repository.findByStartGreaterThanEqualsAndFinishLessThanEqualsOrderByStart(start, finish)
    }

    override fun createData(request: OfferChangeRequest): OfferData {
        val label = request.labelId?.let { labelService.get(it) }
        val guide = request.guideId?.let { guideService.get(it) }
        return OfferData(0, request.start, request.finish, request.maxPersons, request.active, label?.id, guide?.id, timeProvider.now())
    }

    override fun existing(request: OfferChangeRequest): OfferData? {
        return repository.findOneByStart(request.start)
    }

    override fun updateData(data: OfferData, request: OfferChangeRequest): OfferData {
        val label = request.labelId?.let { labelService.get(it) }
        val guide = request.guideId?.let { guideService.get(it) }
        return data.update(request, label, guide, timeProvider.now())
    }

    override fun isValid(request: OfferChangeRequest) {
        if (request.maxPersons <= 0) throw InvalidRequestException("Max Person for offer cannot be below or equals 0")
    }

    fun setActive(id: Long, value: Boolean) = patchData(id) { it.updateActive(value, timeProvider.now()) }
    fun setMaxPersons(id: Long, value: Int) = patchData(id) { if (value >= 0) it.updateMaxPersons(value, timeProvider.now()) }
    fun setLabel(id: Long, labelId: Long) = patchData(id) { it.updateLabel(labelService.get(labelId), timeProvider.now()) }
    fun setGuide(id: Long, guideId: Long) = patchData(id) { it.updateGuide(guideService.get(guideId), timeProvider.now()) }

    internal fun patch(data: OfferData, patch: (OfferData) -> Unit): Offer {
        return patchData(data, patch)
    }

    internal fun createBlock(request: List<OfferChangeRequest>): List<Offer> {
        if (request.isEmpty()) return emptyList()
        val data = request.map { createData(it) }
        val result = repository.saveAll(data).map { it.convert() }
        notify { it.handleBlockCreated(result) }
        return result
    }

    internal fun updateBlock(data: List<OfferData>): List<Offer> {
        if (data.isEmpty()) return emptyList()
        val result = repository.updateAll(data).map { it.convert() }
        notify { it.handleBlockUpdated(result) }
        return result
    }

}
