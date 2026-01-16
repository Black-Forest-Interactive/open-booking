package de.sambalmueslie.openbooking.infrastructure.event

import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.infrastructure.event.api.ChangeEvent
import de.sambalmueslie.openbooking.infrastructure.event.api.ChangeEventType
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import reactor.core.Disposable
import reactor.core.publisher.Flux
import reactor.core.publisher.FluxSink
import java.util.concurrent.ConcurrentLinkedQueue
import java.util.concurrent.CopyOnWriteArrayList
import java.util.function.Consumer


@Singleton
class EventService(
    private val timeProvider: TimeProvider
) {
    companion object {
        private val logger = LoggerFactory.getLogger(EventService::class.java)
        private const val MAX_QUEUE_SIZE: Int = 1000
    }

    private val eventQueue = ConcurrentLinkedQueue<ChangeEvent>()
    private val subscribers = CopyOnWriteArrayList<FluxSink<ChangeEvent>>()

    fun publishEvent(type: ChangeEventType, resourceId: String, resourceType: String) {
        val event = ChangeEvent(type, resourceId, resourceType, timeProvider.now())
        eventQueue.offer(event)

        maintainQueueSize()

        notifySubscribers(event)
    }

    fun subscribe(): Flux<ChangeEvent> {
        return Flux.create(Consumer { sink: FluxSink<ChangeEvent> ->
            subscribers.add(sink)

            sink.next(ChangeEvent(ChangeEventType.OTHER, "CONNECTION", "CONNECTED", timeProvider.now()))

            sink.onDispose(Disposable { subscribers.remove(sink) })
        })
    }

    private fun maintainQueueSize() {
        val size = eventQueue.size
        val elementsToRemove = size - MAX_QUEUE_SIZE
        if (elementsToRemove <= 0) return

        (0..elementsToRemove).forEach { _ -> eventQueue.poll() }
    }


    private fun notifySubscribers(event: ChangeEvent) {
        subscribers.forEach {
            try {
                it.next(event)
            } catch (e: Exception) {
                logger.error("Error in subscribing for $event", e)
                subscribers.remove(it)
            }
        }
    }
}