package de.sambalmueslie.openbooking.backend.group


import de.sambalmueslie.openbooking.backend.group.api.GroupAPI
import de.sambalmueslie.openbooking.backend.group.api.GroupAPI.Companion.PERMISSION_GROUP_READ
import de.sambalmueslie.openbooking.backend.group.api.GroupAPI.Companion.PERMISSION_GROUP_WRITE
import de.sambalmueslie.openbooking.backend.group.api.VisitorGroupChangeRequest
import de.sambalmueslie.openbooking.common.checkPermission
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication

@Controller("/api/backend/group")
class VisitorGroupController(private val service: VisitorGroupService) : GroupAPI {

    @Get("/{id}")
    override fun get(auth: Authentication, @PathVariable id: Long) = auth.checkPermission(PERMISSION_GROUP_READ) {
        service.get(id)
    }

    @Get()
    override fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_GROUP_READ) {
        service.getAll(pageable)
    }

    @Post()
    override fun create(auth: Authentication, @Body request: VisitorGroupChangeRequest) = auth.checkPermission(PERMISSION_GROUP_WRITE) {
        service.create(request)
    }

    @Put("/{id}")
    override fun update(auth: Authentication, @PathVariable id: Long, @Body request: VisitorGroupChangeRequest) = auth.checkPermission(PERMISSION_GROUP_WRITE) {
        service.update(id, request)
    }

    @Delete("/{id}")
    override fun delete(auth: Authentication, @PathVariable id: Long) = auth.checkPermission(PERMISSION_GROUP_WRITE) {
        service.delete(id)
    }


    @Put("/{id}/confirm")
    override fun confirm(auth: Authentication,@PathVariable  id: Long)= auth.checkPermission(PERMISSION_GROUP_WRITE) {
        service.confirm(id)
    }
}
