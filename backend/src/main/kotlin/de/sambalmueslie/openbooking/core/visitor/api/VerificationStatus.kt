package de.sambalmueslie.openbooking.core.visitor.api

enum class VerificationStatus(val order: Int) {
    UNKNOWN(3),
    UNCONFIRMED(1),
    CONFIRMED(0),
    EXPIRED(2),
}
