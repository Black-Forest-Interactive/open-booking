package de.sambalmueslie.openbooking.core.tour.db

import jakarta.persistence.*

@Entity(name = "Tour")
@Table(name = "tour")
data class TourData(
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE) var id: Long,
)
