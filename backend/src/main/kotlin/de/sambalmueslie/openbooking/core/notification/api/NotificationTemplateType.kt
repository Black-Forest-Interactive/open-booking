package de.sambalmueslie.openbooking.core.notification.api

enum class NotificationTemplateType {
    @Deprecated("use booking")
    RESERVATION_CREATED_CONTACT,

    @Deprecated("use booking")
    RESERVATION_CREATED_ADMIN,

    BOOKING_CREATED_CONTACT,
    BOOKING_CREATED_ADMIN,
    BOOKING_CHANGED_CONTACT,
    BOOKING_CHANGED_ADMIN,
}
