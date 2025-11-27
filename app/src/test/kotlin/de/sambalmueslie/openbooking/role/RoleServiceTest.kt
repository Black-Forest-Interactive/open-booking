package de.sambalmueslie.openbooking.role

import de.sambalmueslie.openbooking.backend.role.RoleService
import de.sambalmueslie.openbooking.backend.role.api.TourRole
import de.sambalmueslie.openbooking.backend.role.api.TourRoleChangeRequest
import de.sambalmueslie.openbooking.common.BaseServiceTest
import de.sambalmueslie.openbooking.common.TimeProvider
import io.micronaut.data.model.Pageable
import io.micronaut.test.annotation.MockBean
import io.micronaut.test.extensions.junit5.annotation.MicronautTest
import io.mockk.every
import io.mockk.mockk
import jakarta.inject.Inject
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.time.LocalDateTime

@MicronautTest
internal class RoleServiceTest : BaseServiceTest() {

    @Inject
    lateinit var service: RoleService

    @Test
    fun checkCrud() {
        val now = LocalDateTime.of(2022, 10, 8, 20, 15, 0)
        every { timeProvider.now() } returns now

        // create
        val createRequest = TourRoleChangeRequest("name", "description")
        var result = service.create(createRequest)

        var reference = TourRole(result.id, createRequest.name, createRequest.description)
        assertEquals(reference, result)

        // read
        assertEquals(reference, service.get(reference.id))
        assertEquals(listOf(reference), service.getAll(Pageable.from(0)).content)

        // update
        val updateRequest = TourRoleChangeRequest("update-name", "update-description")
        result = service.update(reference.id, updateRequest)

        reference = TourRole(
            result.id,
            updateRequest.name,
            updateRequest.description
        )
        assertEquals(reference, result)

        // delete
        service.delete(reference.id)

        // read empty
        assertEquals(null, service.get(reference.id))
        assertEquals(emptyList<TourRole>(), service.getAll(Pageable.from(0)).content)
    }
}
