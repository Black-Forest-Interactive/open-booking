package de.sambalmueslie.openbooking.core.offer

import de.sambalmueslie.openbooking.core.guide.GuideService
import de.sambalmueslie.openbooking.core.guide.api.Guide
import de.sambalmueslie.openbooking.core.label.LabelService
import de.sambalmueslie.openbooking.core.label.api.Label
import de.sambalmueslie.openbooking.core.offer.api.Offer
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

    fun convert(data: OfferData): Offer {
        return data.convert()
    }

    fun convert(list: List<OfferData>): List<Offer> {
        return list.map { convert(it) }
    }

    fun convert(page: Page<OfferData>): List<Offer> {
        return page.content.map { convert(it) }
    }

    fun info(data: OfferData): OfferInfo {
        val label = data.labelId?.let { labelService.get(it) }
        val guide = data.guideId?.let { guideService.get(it) }
        return info(data, label, guide)
    }

    fun info(list: List<OfferData>): List<OfferInfo> {
        val labels = labelService.getByIds(list.mapNotNull { it.labelId }.toSet()).associateBy { it.id }
        val guides = guideService.getByIds(list.mapNotNull { it.guideId }.toSet()).associateBy { it.id }

        return list.map { info(it, labels[it.labelId], guides[it.guideId]) }
    }

    fun info(page: Page<OfferData>): Page<OfferInfo> {
        val labels = labelService.getByIds(page.content.mapNotNull { it.labelId }.toSet()).associateBy { it.id }
        val guides = guideService.getByIds(page.content.mapNotNull { it.guideId }.toSet()).associateBy { it.id }
        return page.map { info(it, labels[it.labelId], guides[it.guideId]) }
    }

    private fun info(data: OfferData, label: Label?, guide: Guide?): OfferInfo {
        return OfferInfo(data.convert(), label, guide)
    }
}