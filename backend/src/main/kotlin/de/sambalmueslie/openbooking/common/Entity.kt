package de.sambalmueslie.openbooking.common

import java.time.LocalDateTime

interface Entity<T> {
    val id: T
    val created: LocalDateTime
    val updated: LocalDateTime?
}
