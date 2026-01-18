package de.sambalmueslie.openbooking.core.editor

import de.sambalmueslie.openbooking.common.BaseCrudService
import de.sambalmueslie.openbooking.common.Entity
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.editor.api.Editor
import de.sambalmueslie.openbooking.core.editor.api.EditorChangeListener
import de.sambalmueslie.openbooking.core.editor.api.EditorChangeRequest
import de.sambalmueslie.openbooking.core.reservation.ReservationService
import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.error.InvalidRequestException
import de.sambalmueslie.openbooking.infrastructure.settings.SettingService
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.scheduling.annotation.Scheduled
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import kotlin.reflect.KClass

@Singleton
class EditorService(
    reservationService: ReservationService,
    bookingService: BookingService,
    private val settingService: SettingService,
    private val timeProvider: TimeProvider
) : BaseCrudService<Long, Editor, EditorChangeRequest, EditorChangeListener>(logger) {
    companion object {
        private val logger = LoggerFactory.getLogger(EditorService::class.java)
        private const val DEFAULT_TTL = 300L
    }

    private val idGenerator = EditorIdGenerator()
    private val resourceServices = mutableMapOf(
        Reservation::class to ResourceEditorService(reservationService, idGenerator, Reservation::class, timeProvider),
        Booking::class to ResourceEditorService(bookingService, idGenerator, Booking::class, timeProvider),
    )


    @Scheduled(cron = "0/10 * * * * *")
    fun cleanupExpiredEditors() {
        val timestamp = timeProvider.now()
        resourceServices.values.forEach {
            val expired = it.getExpiredEditors(timestamp)
            expired.values.forEach { editor -> remove(it, editor) }
        }
    }


    override fun get(id: Long): Editor? {
        return resourceServices.values.firstNotNullOfOrNull { it.get(id) }
    }

    fun getByIds(ids: Set<Long>): List<Editor> {
        return resourceServices.values.flatMap { it.getByIds(ids) }
    }

    fun getByUserId(userId: String): List<Editor> {
        return resourceServices.values.flatMap { it.getByUserId(userId) }
    }

    fun getByResource(resourceId: Long, resourceType: KClass<*>): List<Editor> {
        val service = resourceServices[resourceType] ?: return emptyList()
        return service.getByResourceId(resourceId)
    }

    override fun getAll(pageable: Pageable): Page<Editor> {
        TODO("Not yet implemented")
    }


    override fun create(request: EditorChangeRequest): Editor {
        val service = resourceServices[request.resourceType]
            ?: throw InvalidRequestException("Not supported resource type ${request.resourceType}")

        val resource = service.getResource(request.resourceId)
            ?: throw InvalidRequestException("Cannot find resource ${request.resourceId} for editor")
        val result = service.create(resource, request, getExpires())
        notifyCreated(result)
        return result
    }


    override fun update(id: Long, request: EditorChangeRequest): Editor {
        TODO("Not yet implemented")
    }

    override fun delete(id: Long): Editor? {
        return resourceServices.values.map {
            val existing = it.get(id) ?: return@map null
            remove(it, existing)
        }.firstOrNull()
    }

    fun deleteByResource(resourceId: Long, resourceType: KClass<*>): Editor? {
        val service = resourceServices[resourceType] ?: return null
        val existing = service.getByResourceId(resourceId)
        return existing.map { remove(service, it) }.firstOrNull()
    }

    private fun <O : Entity<Long>> remove(service: ResourceEditorService<O>, editor: Editor): Editor {
        val result = service.remove(editor)
        notifyDeleted(result)
        return result
    }

    private fun getExpires(): LocalDateTime {
        return timeProvider.now().plusSeconds(settingService.getEditorTTL().value ?: DEFAULT_TTL)
    }

    fun refresh(resourceId: Long, resourceType: KClass<*>): Editor? {
        val service = resourceServices[resourceType] ?: return null
        val result = service.refresh(resourceId, getExpires())
        result.forEach { notifyUpdated(it) }
        return result.firstOrNull()
    }

}