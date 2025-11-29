package de.sambalmueslie.openbooking.offer

import de.sambalmueslie.openbooking.backend.offer.OfferService
import de.sambalmueslie.openbooking.backend.offer.api.Offer
import de.sambalmueslie.openbooking.backend.offer.api.OfferChangeRequest
import de.sambalmueslie.openbooking.common.BaseServiceTest
import io.micronaut.data.model.Pageable
import io.micronaut.test.extensions.junit5.annotation.MicronautTest
import io.mockk.every
import jakarta.inject.Inject
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.time.LocalDateTime

@MicronautTest
internal class OfferServiceTest : BaseServiceTest(){

    @Inject
    lateinit var service: OfferService

    @Test
    fun checkCrud() {
        val now = LocalDateTime.of(2022, 10, 8, 20, 15, 0)
        every { timeProvider.now() } returns now

        val s1 = LocalDateTime.of(2022, 12, 17, 8, 0, 0)
        val f1 = LocalDateTime.of(2022, 12, 17, 8, 30, 0)
        // create
        val createRequest = OfferChangeRequest(s1, f1, 20, true)
        var result = service.create(createRequest)

        var reference = Offer(result.id, createRequest.start, createRequest.finish, createRequest.maxPersons, createRequest.active)
        assertEquals(reference, result)

        // read
        assertEquals(reference, service.get(reference.id))
        assertEquals(listOf(reference), service.getAll(Pageable.from(0)).content)

        // update
        val s2 = LocalDateTime.of(2022, 12, 17, 9, 0, 0)
        val f2 = LocalDateTime.of(2022, 12, 17, 9, 30, 0)
        val updateRequest = OfferChangeRequest(s2, f2, 40, false)
        result = service.update(reference.id, updateRequest)

        reference = Offer(
            result.id,
            updateRequest.start,
            updateRequest.finish,
            updateRequest.maxPersons,
            updateRequest.active
        )
        assertEquals(reference, result)

        // delete
        service.delete(reference.id)

        // read empty
        assertEquals(null, service.get(reference.id))
        assertEquals(emptyList<Offer>(), service.getAll(Pageable.from(0)).content)
    }

}
