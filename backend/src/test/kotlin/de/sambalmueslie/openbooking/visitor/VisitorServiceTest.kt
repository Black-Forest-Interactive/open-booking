package de.sambalmueslie.openbooking.visitor

import de.sambalmueslie.openbooking.common.BaseServiceTest
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Address
import de.sambalmueslie.openbooking.core.visitor.api.VerificationStatus
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import de.sambalmueslie.openbooking.core.visitor.api.VisitorChangeRequest
import io.micronaut.data.model.Pageable
import io.micronaut.test.extensions.junit5.annotation.MicronautTest
import io.mockk.every
import jakarta.inject.Inject
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.time.LocalDateTime

@MicronautTest
internal class VisitorServiceTest : BaseServiceTest() {

    @Inject
    lateinit var service: VisitorService


    @Test
    fun checkCrud() {
        val now = LocalDateTime.of(2022, 10, 8, 20, 15, 0)
        every { timeProvider.now() } returns now

        // create
        val createRequest = VisitorChangeRequest("title", 1, true, 2, 3, "contact", Address("street", "city", "zip"), "phone", "email")
        var result = service.create(createRequest)

        var reference = Visitor(
            result.id, createRequest.title, createRequest.size, createRequest.isGroup, createRequest.minAge, createRequest.maxAge, createRequest.contact,
            createRequest.address, createRequest.phone, createRequest.email, VerificationStatus.UNCONFIRMED
        )
        assertEquals(reference, result)

        // read
        assertEquals(reference, service.get(reference.id))
        assertEquals(listOf(reference), service.getAll(Pageable.from(0)).content)

        // update
        val updateRequest = VisitorChangeRequest("update-title", 10, false, 20, 30, "update-contact", Address("update-street", "update-city", "update-zip"), "update-phone", "update-email")
        result = service.update(reference.id, updateRequest)

        reference = Visitor(
            result.id,
            updateRequest.title,
            updateRequest.size,
            updateRequest.isGroup,
            updateRequest.minAge,
            updateRequest.maxAge,
            updateRequest.contact,
            updateRequest.address,
            updateRequest.phone,
            updateRequest.email,
            VerificationStatus.UNCONFIRMED
        )
        assertEquals(reference, result)

        // delete
        service.delete(reference.id)

        // read empty
        assertEquals(null, service.get(reference.id))
        assertEquals(emptyList<Visitor>(), service.getAll(Pageable.from(0)).content)
    }
}
