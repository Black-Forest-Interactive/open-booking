package de.sambalmueslie.openbooking.visitor

import de.sambalmueslie.openbooking.common.BaseServiceTest
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.*
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
        val createRequest = VisitorChangeRequest(VisitorType.GROUP, "title", "description", 1, 2, 3, "contact", Address("street", "city", "zip"), "phone", "email")
        var result = service.create(createRequest)

        var reference = Visitor(
            result.id, createRequest.type, createRequest.title, createRequest.description, createRequest.size, createRequest.minAge, createRequest.maxAge, createRequest.name,
            createRequest.address, createRequest.phone, createRequest.email, Verification(VerificationStatus.UNCONFIRMED, null)
        )
        assertEquals(reference, result)

        // read
        assertEquals(reference, service.get(reference.id))
        assertEquals(listOf(reference), service.getAll(Pageable.from(0)).content)

        // update
        val updateRequest = VisitorChangeRequest(
            VisitorType.GROUP,
            "update-title",
            "update-description",
            10,
            20,
            30,
            "update-contact",
            Address("update-street", "update-city", "update-zip"),
            "update-phone",
            "update-email"
        )
        result = service.update(reference.id, updateRequest)

        reference = Visitor(
            result.id,
            updateRequest.type,
            updateRequest.title,
            updateRequest.description,
            updateRequest.size,
            updateRequest.minAge,
            updateRequest.maxAge,
            updateRequest.name,
            updateRequest.address,
            updateRequest.phone,
            updateRequest.email,
            Verification(VerificationStatus.UNCONFIRMED, null)
        )
        assertEquals(reference, result)

        // delete
        service.delete(reference.id)

        // read empty
        assertEquals(null, service.get(reference.id))
        assertEquals(emptyList<Visitor>(), service.getAll(Pageable.from(0)).content)
    }
}
