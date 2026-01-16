package de.sambalmueslie.openbooking.gateway.admin.reservation

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.common.getEmail
import de.sambalmueslie.openbooking.common.getExternalId
import de.sambalmueslie.openbooking.common.getUsername
import de.sambalmueslie.openbooking.core.editor.EditorService
import de.sambalmueslie.openbooking.core.editor.api.EditorChangeRequest
import de.sambalmueslie.openbooking.core.reservation.ReservationService
import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.core.reservation.api.ReservationChangeRequest
import de.sambalmueslie.openbooking.core.reservation.api.ReservationConfirmationContent
import de.sambalmueslie.openbooking.core.reservation.assembler.ReservationDetailsAssembler
import de.sambalmueslie.openbooking.core.reservation.assembler.ReservationInfoAssembler
import de.sambalmueslie.openbooking.core.search.reservation.ReservationSearchOperator
import de.sambalmueslie.openbooking.core.search.reservation.api.ReservationSearchRequest
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_RESERVATION_ADMIN
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class ReservationGateway(
    private val service: ReservationService,
    private val infoAssembler: ReservationInfoAssembler,
    private val detailsAssembler: ReservationDetailsAssembler,
    private val searchOperator: ReservationSearchOperator,
    private val editorService: EditorService,
) {
    fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { service.getAll(pageable) }
    fun get(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { service.get(id) }
    fun getInfo(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { infoAssembler.get(id) }
    fun getDetails(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { detailsAssembler.get(id) }
    fun search(auth: Authentication, request: ReservationSearchRequest, pageable: Pageable) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { searchOperator.search(request, pageable) }

    fun create(auth: Authentication, request: ReservationChangeRequest) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { service.create(request) }
    fun update(auth: Authentication, id: Long, request: ReservationChangeRequest) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { service.update(id, request) }
    fun delete(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { service.delete(id) }

    fun getRequestReceivedMessage(auth: Authentication, id: Long, lang: String) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { service.getReservationReceivedMessage(id, lang) }
    fun getConfirmationMessage(auth: Authentication, id: Long, lang: String) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { service.getConfirmationMessage(id, lang) }

    fun confirm(auth: Authentication, id: Long, content: ReservationConfirmationContent) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { service.confirm(id, content) }
    fun getDenialMessage(auth: Authentication, id: Long, lang: String) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { service.getDenialMessage(id, lang) }
    fun deny(auth: Authentication, id: Long, content: ReservationConfirmationContent) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { service.deny(id, content) }
    fun getUnconfirmedAmount(auth: Authentication) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { searchOperator.getUnconfirmedAmount() }

    fun createEditor(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) {
        editorService.create(EditorChangeRequest(id, Reservation::class, auth.getExternalId(), auth.getUsername().ifBlank { auth.getEmail() }))
    }

    fun refreshEditor(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) {
        editorService.refresh(id, Reservation::class) ?: editorService.create(EditorChangeRequest(id, Reservation::class, auth.getExternalId(), auth.getUsername().ifBlank { auth.getEmail() }))
    }

    fun deleteEditor(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { editorService.deleteByResource(id, Reservation::class) }
    fun getEditor(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { editorService.getByResource(id, Reservation::class) }

}