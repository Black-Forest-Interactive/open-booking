package de.sambalmueslie.openbooking.core.notification


import de.sambalmueslie.openbooking.core.notification.api.NotificationEvent
import de.sambalmueslie.openbooking.core.notification.processor.NotificationEventProcessor
import io.micronaut.scheduling.annotation.Scheduled
import jakarta.inject.Singleton
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import kotlin.system.measureTimeMillis

@Singleton
class NotificationService(
    private val processor: List<NotificationEventProcessor>
) {


    companion object {
        private val logger: Logger = LoggerFactory.getLogger(NotificationService::class.java)
    }

    private val eventQueue = mutableListOf<NotificationEvent>()

    @Synchronized
    fun add(event: NotificationEvent) {
        eventQueue.add(event)
    }

    @Synchronized
    private fun getEvents(): List<NotificationEvent> {
        val events = eventQueue.toList()
        eventQueue.clear()
        return events
    }

    @Scheduled(cron = "0/10 * * * * ?")
    fun processEvents() {
        val duration = measureTimeMillis {
            val events = getEvents()
            if (events.isEmpty()) return
            events.forEach { process(it) }
        }
        logger.info("Process events finished within $duration ms.")
    }

    private fun process(event: NotificationEvent) {
        try {
            processor.forEach { it.process(event) }
        } catch (e: Exception) {
            logger.error("Error while processing notification event ${event.type}", e)
        }
    }
}
