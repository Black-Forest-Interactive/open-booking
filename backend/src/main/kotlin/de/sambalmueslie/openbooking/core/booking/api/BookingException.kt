package de.sambalmueslie.openbooking.core.booking.api

import de.sambalmueslie.openbooking.common.EntityException

sealed class BookingException(code: Int, msg: String, payload: String = "") : EntityException(Booking::class, code, msg, payload)

private var i = 0

class BookingOfferInvalid(offerId: Long) : BookingException(i++, "BOOKING.Error.InvalidOffer", offerId.toString())
class BookingVisitorInvalid(visitorId: Long) : BookingException(i++, "BOOKING.Error.InvalidVisitor", visitorId.toString())
class BookingOfferNotSuitable(offerId: Long) : BookingException(i++, "BOOKING.Error.NoSuitable", offerId.toString())
class BookingInvalidSize(value: String) : BookingException(i++, "BOOKING.Error.InvalidSize", value)
class BookingAcceptTermsRequired() : BookingException(i++, "BOOKING.Error.AcceptTermsRequired")
class BookingClaimedBySomeoneElse() : BookingException(i++, "BOOKING.Error.ClaimedBySomeoneElse")
class BookingKeyInvalid(key: String) : BookingException(i++, "BOOKING.Error.KeyInvalid", key)

