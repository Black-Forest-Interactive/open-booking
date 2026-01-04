package de.sambalmueslie.openbooking.core.offer

import de.sambalmueslie.openbooking.core.guide.GuideService
import de.sambalmueslie.openbooking.core.guide.api.Guide
import de.sambalmueslie.openbooking.core.label.LabelService
import de.sambalmueslie.openbooking.core.label.api.Label
import de.sambalmueslie.openbooking.core.offer.api.OfferInfo
import de.sambalmueslie.openbooking.core.offer.db.OfferData
import io.micronaut.data.model.Page
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class OfferConverter(
    private val labelService: LabelService,
    private val guideService: GuideService,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(OfferConverter::class.java)
    }

    fun pageToInfo(provider: () -> Page<OfferData>): Page<OfferInfo> {
        return info(provider.invoke())
    }

    fun listToInfo(provider: () -> List<OfferData>): List<OfferInfo> {
        return info(provider.invoke())
    }

    fun dataToInfo(provider: () -> OfferData?): OfferInfo? {
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

    private fun info(data: OfferData): OfferInfo? {
        val label = data.labelId?.let { labelService.get(it) }
        val guide = data.guideId?.let { guideService.get(it) }
        return info(data, label, guide)
    }

    private fun info(data: OfferData, label: Label?, guide: Guide?): OfferInfo {
        return OfferInfo(data.convert(), label, guide)
    }

}