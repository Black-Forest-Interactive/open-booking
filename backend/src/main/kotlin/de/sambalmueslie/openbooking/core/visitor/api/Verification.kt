package de.sambalmueslie.openbooking.core.visitor.api

import java.time.LocalDateTime

data class Verification(
    val status: VerificationStatus,
    val timestamp: LocalDateTime?,
)
