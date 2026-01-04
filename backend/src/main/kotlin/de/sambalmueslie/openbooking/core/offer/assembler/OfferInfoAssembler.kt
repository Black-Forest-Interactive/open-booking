package de.sambalmueslie.openbooking.core.offer.assembler

import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.guide.GuideService
import de.sambalmueslie.openbooking.core.guide.api.Guide
import de.sambalmueslie.openbooking.core.label.LabelService
import de.sambalmueslie.openbooking.core.label.api.Label
import de.sambalmueslie.openbooking.core.offer.api.OfferInfo
import de.sambalmueslie.openbooking.core.offer.db.OfferData
import de.sambalmueslie.openbooking.core.offer.db.OfferRepository
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDate

@Singleton
class OfferInfoAssembler(
    private val repository: OfferRepository,
    private val labelService: LabelService,
    private val guideService: GuideService,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(OfferInfoAssembler::class.java)
    }


    fun getAllInfos(pageable: Pageable): Page<OfferInfo> {
        return pageToInfo { repository.findAllOrderByStart(pageable) }
    }

    fun getInfo(id: Long): OfferInfo? {
        return dataToInfo { repository.findByIdOrNull(id) }
    }

    fun getInfoByIds(ids: Set<Long>): List<OfferInfo> {
        return listToInfo { repository.findByIdIn(ids) }
    }

    fun getInfoByDate(date: LocalDate): List<OfferInfo> {
        return listToInfo { getDataByDate(date) }
    }


    private fun pageToInfo(provider: () -> Page<OfferData>): Page<OfferInfo> {
        return info(provider.invoke())
    }

    private fun listToInfo(provider: () -> List<OfferData>): List<OfferInfo> {
        return info(provider.invoke())
    }

    private fun dataToInfo(provider: () -> OfferData?): OfferInfo? {
        val data = provider.invoke() ?: return null
        return info(data)
    }

    private fun info(data: Page<OfferData>): Page<OfferInfo> {
        val result = info(data.content)
        return Page.of(result, data.pageable, data.totalSize)
    }


    private fun info(data: List<OfferData>): List<OfferInfo> {
        val labelIds = data.mapNotNull { it.labelId }.toSet()
        val labels = labelService.getByIds(labelIds).associateBy { it.id }

        val guideIds = data.mapNotNull { it.guideId }.toSet()
        val guides = guideService.getByIds(guideIds).associateBy { it.id }

        return data.mapNotNull { info(it, labels, guides) }
    }

    private fun info(data: OfferData, labels: Map<Long, Label>, guides: Map<Long, Guide>): OfferInfo? {
        val label = labels[data.labelId]
        val guide = guides[data.guideId]

        return info(data, label, guide)
    }

    private fun info(data: OfferData): OfferInfo {
        val label = data.labelId?.let { labelService.get(it) }
        val guide = data.guideId?.let { guideService.get(it) }
        return info(data, label, guide)
    }

    private fun info(data: OfferData, label: Label?, guide: Guide?): OfferInfo {
        return OfferInfo(data.convert(), label, guide)
    }

    private fun getDataByDate(date: LocalDate): List<OfferData> {
        val start = date.atStartOfDay()
        val finish = date.atTime(23, 59, 59)
        return repository.findByStartGreaterThanEqualsAndFinishLessThanEqualsOrderByStart(start, finish)
    }
}