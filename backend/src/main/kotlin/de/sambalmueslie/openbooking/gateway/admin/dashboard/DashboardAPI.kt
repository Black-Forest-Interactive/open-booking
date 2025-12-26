package de.sambalmueslie.openbooking.gateway.admin.dashboard

import java.time.LocalDate
import java.time.LocalDateTime

// Data Models
data class CalendarResponse(
    val weeks: List<WeekSummary>,
    val dailyOffers: List<DailyOffers>
)

data class WeekSummary(
    val weekNumber: Int,
    val startDate: LocalDate,
    val endDate: LocalDate,
    val pendingCount: Int,
    val days: List<DaySummary>
)

data class DaySummary(
    val date: LocalDate,
    val dayOfWeek: String,
    val pendingCount: Int
)

data class DailyOffers(
    val date: LocalDate,
    val offers: List<ShowOffer>
)

data class ShowOffer(
    val id: String,
    val showName: String,
    val guide: String,
    val color: String,
    val timeSlot: String,
    val totalSeats: Int,
    val bookings: List<Booking>
)

data class Booking(
    val id: String,
    val guests: Int,
    val customerName: String,
    val email: String,
    val phone: String,
    val address: String,
    val comment: String?,
    val confirmed: Boolean,
    val emailSent: Boolean,
    val emailDelivered: Boolean,
    val createdAt: LocalDateTime
)

data class DailyOffersFilterRequest(
    val guide: String,
    val status: String,
    val showName: String,
)

// Extension functions
fun ShowOffer.getConfirmedSeats(): Int =
    bookings.filter { it.confirmed }.sumOf { it.guests }

fun ShowOffer.getPendingSeats(): Int =
    bookings.filter { !it.confirmed }.sumOf { it.guests }

fun ShowOffer.getAvailableSeats(): Int =
    totalSeats - getConfirmedSeats()

fun ShowOffer.hasPendingBookings(): Boolean =
    bookings.any { !it.confirmed }

// Sample Data Generation
fun generateSampleCalendarData(): CalendarResponse {
    val startDate = LocalDate.of(2024, 1, 15)
    val guides = listOf("Sarah Johnson", "Mike Chen", "Emily Rodriguez", "David Kim", "Lisa Anderson", "Tom Williams", "Jessica Lee")
    val shows = listOf(
        "Magic Show Spectacular",
        "Comedy Night",
        "Theater Performance",
        "Music Concert",
        "Dance Show",
        "Opera Evening",
        "Circus Act",
        "Puppet Show",
        "Stand-up Comedy",
        "Musical Theater"
    )
    val colors = listOf(
        "#8B5CF6", "#F59E0B", "#EC4899", "#10B981", "#3B82F6",
        "#EF4444", "#06B6D4", "#F97316", "#6366F1", "#14B8A6"
    )
    val timeSlots = listOf(
        "10:00 AM - 11:00 AM", "11:30 AM - 12:30 PM", "1:00 PM - 2:00 PM",
        "2:30 PM - 3:30 PM", "4:00 PM - 5:00 PM", "5:30 PM - 6:30 PM",
        "7:00 PM - 8:00 PM", "8:30 PM - 9:30 PM", "9:45 PM - 10:45 PM",
        "11:00 PM - 12:00 AM"
    )
    val names = listOf("John Smith", "Jane Doe", "Bob Wilson", "Alice Brown", "Charlie Davis", "Eve Martinez", "Frank Lee", "Grace Taylor")

    val dailyOffers = mutableListOf<DailyOffers>()
    val allDays = mutableListOf<DaySummary>()

    for (day in 0 until 28) {
        val currentDate = startDate.plusDays(day.toLong())

        val dayOffers = shows.mapIndexed { idx, showName ->
            ShowOffer(
                id = "offer-$currentDate-$idx",
                showName = showName,
                guide = guides.random(),
                color = colors[idx],
                timeSlot = timeSlots[idx],
                totalSeats = (15..30).random(),
                bookings = generateRandomBookings(day, idx, names, currentDate)
            )
        }

        dailyOffers.add(DailyOffers(currentDate, dayOffers))

        val pendingCount = dayOffers.sumOf { offer ->
            offer.bookings.count { !it.confirmed }
        }

        allDays.add(
            DaySummary(
                date = currentDate,
                dayOfWeek = currentDate.dayOfWeek.toString().take(3),
                pendingCount = pendingCount
            )
        )
    }

    val weeks = (0..3).map { weekIndex ->
        val weekStart = weekIndex * 7
        val weekEnd = minOf(weekStart + 6, 27)
        val weekDays = allDays.subList(weekStart, weekEnd + 1)

        WeekSummary(
            weekNumber = weekIndex + 1,
            startDate = weekDays.first().date,
            endDate = weekDays.last().date,
            pendingCount = weekDays.sumOf { it.pendingCount },
            days = weekDays
        )
    }

    return CalendarResponse(
        weeks = weeks,
        dailyOffers = dailyOffers
    )
}

fun generateRandomBookings(day: Int, showIdx: Int, names: List<String>, bookingDate: LocalDate): List<Booking> {
    val bookingCount = (0..3).random()

    return (0 until bookingCount).map { i ->
        val customerName = names.random()
        val firstName = customerName.split(" ").first().lowercase()

        Booking(
            id = "b-$day-$showIdx-$i",
            guests = (1..6).random(),
            customerName = customerName,
            email = "$firstName@example.com",
            phone = "+1 ${(100..999).random()}-${(100..999).random()}-${(1000..9999).random()}",
            address = "${(1000..9999).random()} Main St, City, ST ${(10000..99999).random()}",
            comment = listOf(
                "Wheelchair access needed",
                "Celebrating anniversary",
                "First time visitor",
                "Allergic to smoke effects",
                null,
                null
            ).random(),
            confirmed = Math.random() > 0.3,
            emailSent = Math.random() > 0.2,
            emailDelivered = Math.random() > 0.1,
            createdAt = bookingDate.atTime((9..20).random(), (0..59).random())
        )
    }
}


