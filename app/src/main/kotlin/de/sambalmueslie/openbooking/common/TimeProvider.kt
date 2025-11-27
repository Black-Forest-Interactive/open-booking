package de.sambalmueslie.openbooking.common

import java.time.LocalDateTime

interface TimeProvider {
    fun now(): LocalDateTime
}
