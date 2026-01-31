package de.sambalmueslie.openbooking.core.offer

import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.common.measureTimeMillisWithReturn
import de.sambalmueslie.openbooking.core.offer.api.OfferChangeDurationRequest
import de.sambalmueslie.openbooking.core.offer.api.OfferRangeRequest
import de.sambalmueslie.openbooking.core.offer.api.OfferRedistributeRequest
import de.sambalmueslie.openbooking.core.offer.api.OfferSeriesRequest
import de.sambalmueslie.openbooking.core.offer.feature.*
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDate
import java.util.concurrent.atomic.AtomicBoolean

@Singleton
class OfferOperator(
    private val createSeriesFeature: OfferCreateSeriesFeature,
    private val createRangeFeature: OfferCreateRangeFeature,
    private val redistributeFeature: OfferRedistributeFeature,
    private val labelFeature: OfferLabelFeature,
    private val changeDurationFeature: OfferChangeDurationFeature,
) {

    companion object {
        private val logger = LoggerFactory.getLogger(OfferOperator::class.java)
        const val MSG_OFFER_PROCESSING_FAIL = "REQUEST.OFFER.PROCESSING.FAIL"
    }

    private val processing = AtomicBoolean(false)

    fun createSeries(request: OfferSeriesRequest): GenericRequestResult {
        return process("CreateSeries") {
            createSeriesFeature.process(request)
        }
    }

    fun createRange(request: OfferRangeRequest): GenericRequestResult {
        return process("CreateRange") {
            createRangeFeature.process(request)
        }
    }

    fun redistribute(request: OfferRedistributeRequest): GenericRequestResult {
        return process("Redistribute") {
            val result = redistributeFeature.process(request)
            if (result.success) {
                labelFeature.process(request.date)
            }
            return@process result
        }
    }

    fun relabel(date: LocalDate): GenericRequestResult {
        return process("Relabel") {
            labelFeature.process(date)
        }
    }

    fun changeDuration(request: OfferChangeDurationRequest): GenericRequestResult {
        return process("ChangeDuration") {
            changeDurationFeature.process(request)
        }
    }

    private fun process(cmd: String, action: () -> GenericRequestResult): GenericRequestResult {
        if (processing.get()) return GenericRequestResult(false, MSG_OFFER_PROCESSING_FAIL)
        processing.set(true)
        val (duration, result) = measureTimeMillisWithReturn {
            try {
                action.invoke()
            } catch (e: Exception) {
                logger.error("[$cmd] Processing failed", e)
                return GenericRequestResult(false, MSG_OFFER_PROCESSING_FAIL)
            }
        }
        logger.debug("[$cmd] Processing finished after $duration ms")
        processing.set(false)
        return result
    }
}