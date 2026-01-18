package de.sambalmueslie.openbooking.core.editor

import de.sambalmueslie.openbooking.common.Entity
import de.sambalmueslie.openbooking.common.CrudService
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.editor.api.Editor
import de.sambalmueslie.openbooking.core.editor.api.EditorChangeRequest
import de.sambalmueslie.openbooking.error.InvalidRequestException
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.locks.ReentrantReadWriteLock
import kotlin.concurrent.read
import kotlin.concurrent.write
import kotlin.reflect.KClass

class ResourceEditorService<O : Entity<Long>>(
    private val service: CrudService<Long, O, *, *>,
    private val idGenerator: EditorIdGenerator,
    private val resourceType: KClass<O>,
    private val timeProvider: TimeProvider
) {
    companion object {
        private val logger = LoggerFactory.getLogger(ResourceEditorService::class.java)
    }

    private val resourceName = resourceType.simpleName ?: "unknown"
    private val editors = ConcurrentHashMap<Long, Editor>()
    private val lock = ReentrantReadWriteLock()

    internal fun getResource(resourceId: Long): O? {
        return service.get(resourceId)
    }

    internal fun get(id: Long): Editor? {
        return editors[id]
    }

    internal fun getByIds(ids: Set<Long>): List<Editor> {
        return ids.mapNotNull { editors[it] }
    }

    internal fun getByUserId(userId: String): List<Editor> {
        return lock.read {
            editors.values.filter { it.userId == userId }
        }
    }

    internal fun getByResourceId(resourceId: Long): List<Editor> {
        return lock.read {
            editors.values.filter { it.resourceId == resourceId }
        }
    }


    internal fun getExpiredEditors(timestamp: LocalDateTime): Map<Long, Editor> {
        return lock.read {
            editors.filterValues { editor ->
                editor.expires.isBefore(timestamp)
            }
        }
    }

    internal fun create(resource: Entity<Long>, request: EditorChangeRequest, expires: LocalDateTime): Editor {
        return lock.write {
            val existing = editors.values.find { it.resourceId == resource.id }
            when {
                existing == null -> add(resource, request, expires)
                existing.userId == request.userId -> existing
                else -> throw InvalidRequestException("Cannot create editor on already edited reservation")
            }
        }
    }

    private fun add(resource: Entity<Long>, request: EditorChangeRequest, expires: LocalDateTime): Editor {
        val id = idGenerator.getId()
        val editor = Editor(id, resource.id, resourceName, request.userId, request.userName, timeProvider.now(), expires)
        editors[id] = editor
        logger.debug("Editor {} added", editor)
        return editor
    }

    internal fun remove(editor: Editor): Editor {
        lock.write {
            editors.remove(editor.id)
        }
        logger.debug("Editor {} removed", editor)
        return editor
    }

    fun refresh(resourceId: Long, expires: LocalDateTime): List<Editor> {
        return lock.write {
            val editors = editors.values.filter { it.resourceId == resourceId }
            editors.forEach { editor -> editor.expires = expires }
            editors
        }
    }
}