package de.sambalmueslie.openbooking.staff

import de.sambalmueslie.openbooking.common.BaseServiceTest
import de.sambalmueslie.openbooking.core.guide.GuideService
import de.sambalmueslie.openbooking.core.guide.api.Guide
import de.sambalmueslie.openbooking.core.guide.api.GuideChangeRequest
import io.micronaut.data.model.Pageable
import io.micronaut.test.extensions.junit5.annotation.MicronautTest
import io.mockk.every
import jakarta.inject.Inject
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.time.LocalDateTime

@MicronautTest
internal class GuideServiceTest : BaseServiceTest() {

    @Inject
    lateinit var service: GuideService

    @Test
    fun checkCrud() {
        val now = LocalDateTime.of(2022, 10, 8, 20, 15, 0)
        every { timeProvider.now() } returns now

        // create
        val createRequest = GuideChangeRequest("firstName", "lastName", "email", "phone", "mobile")
        var result = service.create(createRequest)

        var reference = Guide(result.id, createRequest.firstName, createRequest.lastName, createRequest.email, createRequest.phone, createRequest.mobile)
        assertEquals(reference, result)

        // read
        assertEquals(reference, service.get(reference.id))
        assertEquals(listOf(reference), service.getAll(Pageable.from(0)).content)

        // update
        val updateRequest = GuideChangeRequest("update-firstName", "update-lastName", "update-email", "update-phone", "update-mobile")
        result = service.update(reference.id, updateRequest)

        reference = Guide(
            result.id,
            updateRequest.firstName,
            updateRequest.lastName,
            updateRequest.email,
            updateRequest.phone,
            updateRequest.mobile,
        )
        assertEquals(reference, result)

        // delete
        service.delete(reference.id)

        // read empty
        assertEquals(null, service.get(reference.id))
        assertEquals(emptyList<Guide>(), service.getAll(Pageable.from(0)).content)
    }

}
