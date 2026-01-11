package de.sambalmueslie.openbooking.core.offer

import de.sambalmueslie.openbooking.core.label.db.LabelData
import de.sambalmueslie.openbooking.core.label.db.LabelRepository
import de.sambalmueslie.openbooking.core.offer.api.OfferRedistributeRequest
import de.sambalmueslie.openbooking.core.offer.db.OfferData
import de.sambalmueslie.openbooking.core.offer.db.OfferRepository
import io.micronaut.test.extensions.junit5.annotation.MicronautTest
import jakarta.inject.Inject
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.time.Duration
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@MicronautTest
class OfferRedistributeServiceTest {

    @Inject
    lateinit var offerService: OfferService

    @Inject
    lateinit var offerOperator: OfferOperator

    @Inject
    lateinit var offerRepository: OfferRepository

    @Inject
    lateinit var labelRepository: LabelRepository

    private lateinit var labels: List<LabelData>
    private val testDate = LocalDate.of(2024, 3, 15)

    @BeforeEach
    fun setup() {
        // Clean up before each test
        offerRepository.deleteAll()
        labelRepository.deleteAll()

        // Create test labels
        labels = listOf(
            LabelData(
                id = 0L,
                name = "Label 0",
                color = "#0070C0",
                priority = 0,
                created = LocalDateTime.now()
            ),
            LabelData(
                id = 0L,
                name = "Label 1",
                color = "#A6A6A6",
                priority = 1,
                created = LocalDateTime.now()
            ),
            LabelData(
                id = 0L,
                name = "Label 2",
                color = "#BF8F00",
                priority = 2,
                created = LocalDateTime.now()
            ),
            LabelData(
                id = 0L,
                name = "Label 3",
                color = "#B4C6E7",
                priority = 3,
                created = LocalDateTime.now()
            )
        ).map { labelRepository.save(it) }
    }

    @AfterEach
    fun cleanup() {
        offerRepository.deleteAll()
        labelRepository.deleteAll()
    }

    @Test
    fun `test redistribute offers with 20 minute interval to 15 minute interval`() {
        // Given: Offers at 9:00, 9:20, 9:40, 10:00 (20 min interval, 45 min duration)
        val originalOffers = listOf(
            createOffer(testDate, LocalTime.of(9, 0), labels[0].id),
            createOffer(testDate, LocalTime.of(9, 20), labels[1].id),
            createOffer(testDate, LocalTime.of(9, 40), labels[2].id),
            createOffer(testDate, LocalTime.of(10, 0), labels[3].id)
        ).map { offerRepository.save(it) }

        // When: Redistribute with 15 minute interval
        val request = OfferRedistributeRequest(
            date = testDate,
            timeFrom = LocalTime.of(9, 0),
            timeTo = LocalTime.of(11, 0),
            duration = Duration.ofMinutes(15)
        )

        val result = offerOperator.redistribute(request)

        // Then: Verify the result
        assertTrue(result.success, "Redistribution should succeed")

        // Fetch all offers for the test date
        val redistributedOffers = offerRepository.findAll()
            .filter { it.start.toLocalDate() == testDate }
            .sortedBy { it.start }

        // Expected: 9:00, 9:15, 9:30, 9:45, 10:00, ... (15 min interval)
        // Should have more offers than before
        assertTrue(
            redistributedOffers.size > originalOffers.size,
            "Should have more offers after redistribution"
        )

        // Verify first offer remains at 9:00
        assertEquals(
            LocalTime.of(9, 0), redistributedOffers[0].start.toLocalTime(),
            "First offer should start at 9:00"
        )

        // Verify new offer at 9:15 exists
        val offer915 = redistributedOffers.find { it.start.toLocalTime() == LocalTime.of(9, 15) }
        assertNotNull(offer915, "Should have an offer at 9:15")

        // Verify offers are at 15 minute intervals
        for (i in 0 until redistributedOffers.size - 1) {
            val currentStart = redistributedOffers[i].start
            val nextStart = redistributedOffers[i + 1].start
            val interval = Duration.between(currentStart, nextStart)

            assertEquals(
                Duration.ofMinutes(15), interval,
                "Offers should be 15 minutes apart"
            )
        }

        // Verify all offers maintain 45 minute duration
        redistributedOffers.forEach { offer ->
            val duration = Duration.between(offer.start, offer.finish)
            assertEquals(
                Duration.ofMinutes(45), duration,
                "Each offer should have 45 minute duration"
            )
        }

        // Verify label priority order is maintained
        verifyLabelPriorityOrder(redistributedOffers)
    }

    @Test
    fun `test redistribute maintains label priority order`() {
        // Given: 4 offers with labels in priority order
        val originalOffers = listOf(
            createOffer(testDate, LocalTime.of(9, 0), labels[0].id),   // Priority 0
            createOffer(testDate, LocalTime.of(9, 20), labels[1].id),  // Priority 1
            createOffer(testDate, LocalTime.of(9, 40), labels[2].id),  // Priority 2
            createOffer(testDate, LocalTime.of(10, 0), labels[3].id)   // Priority 3
        ).map { offerRepository.save(it) }

        // When: Redistribute
        val request = OfferRedistributeRequest(
            date = testDate,
            timeFrom = LocalTime.of(9, 0),
            timeTo = LocalTime.of(11, 0),
            duration = Duration.ofMinutes(15)
        )

        offerOperator.redistribute(request)

        // Then: Verify label order
        val redistributedOffers = offerRepository.findAll()
            .filter { it.start.toLocalDate() == testDate }
            .sortedBy { it.start }

        verifyLabelPriorityOrder(redistributedOffers)
    }

    @Test
    fun `test redistribute with different time range`() {
        // Given: Offers in the afternoon
        val originalOffers = listOf(
            createOffer(testDate, LocalTime.of(14, 0), labels[0].id),
            createOffer(testDate, LocalTime.of(14, 20), labels[1].id),
            createOffer(testDate, LocalTime.of(14, 40), labels[2].id)
        ).map { offerRepository.save(it) }

        // When: Redistribute afternoon offers
        val request = OfferRedistributeRequest(
            date = testDate,
            timeFrom = LocalTime.of(14, 0),
            timeTo = LocalTime.of(16, 0),
            duration = Duration.ofMinutes(15)
        )

        val result = offerOperator.redistribute(request)

        // Then: Verify redistribution
        assertTrue(result.success)

        val redistributedOffers = offerRepository.findAll()
            .filter { it.start.toLocalDate() == testDate }
            .filter { it.start.toLocalTime() >= LocalTime.of(14, 0) }
            .sortedBy { it.start }

        assertTrue(redistributedOffers.isNotEmpty())
        assertEquals(LocalTime.of(14, 0), redistributedOffers.first().start.toLocalTime())

        // Verify 15 minute intervals
        for (i in 0 until redistributedOffers.size - 1) {
            val interval = Duration.between(
                redistributedOffers[i].start,
                redistributedOffers[i + 1].start
            )
            assertEquals(Duration.ofMinutes(15), interval)
        }
    }

    @Test
    fun `test redistribute preserves offer properties`() {
        // Given: Offers with specific properties
        val offer = createOffer(testDate, LocalTime.of(9, 0), labels[0].id).copy(
            maxPersons = 10,
            active = true,
            guideId = 123L
        )
        offerRepository.save(offer)

        // When: Redistribute
        val request = OfferRedistributeRequest(
            date = testDate,
            timeFrom = LocalTime.of(9, 0),
            timeTo = LocalTime.of(10, 0),
            duration = Duration.ofMinutes(15)
        )

        offerOperator.redistribute(request)

        // Then: Verify properties are preserved
        val redistributedOffers = offerRepository.findAll()
            .filter { it.start.toLocalDate() == testDate }

        redistributedOffers.forEach { redistributedOffer ->
            assertEquals(10, redistributedOffer.maxPersons)
            assertTrue(redistributedOffer.active)
            // Note: guideId might be cleared during redistribution depending on business logic
        }
    }

    private fun createOffer(
        date: LocalDate,
        time: LocalTime,
        labelId: Long
    ): OfferData {
        val start = LocalDateTime.of(date, time)
        return OfferData(
            id = 0L,
            start = start,
            finish = start.plusMinutes(45),
            maxPersons = 8,
            active = true,
            labelId = labelId,
            guideId = null,
            created = LocalDateTime.now()
        )
    }

    private fun verifyLabelPriorityOrder(offers: List<OfferData>) {
        // Get labels with their priorities
        val labelPriorities = labels.associate { it.id to it.priority }

        // Group offers by label and verify they maintain priority order
        val offersWithPriority = offers
            .filter { it.labelId != null }
            .map { offer ->
                offer to (labelPriorities[offer.labelId] ?: Int.MAX_VALUE)
            }
            .sortedBy { it.first.start }

        // Verify that for each position, the label priority increases or stays same
        for (i in 0 until offersWithPriority.size - 1) {
            val currentPriority = offersWithPriority[i].second
            val nextPriority = offersWithPriority[i + 1].second

            assertTrue(
                currentPriority <= nextPriority,
                "Label priority order should be maintained: offer at ${offersWithPriority[i].first.start} " +
                        "has priority $currentPriority, next offer at ${offersWithPriority[i + 1].first.start} " +
                        "has priority $nextPriority"
            )
        }
    }
}