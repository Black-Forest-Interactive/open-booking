package de.sambalmueslie.openbooking.backend.offer.db

import io.micronaut.data.repository.jpa.criteria.PredicateSpecification
import java.time.LocalDate


object Queries {
    fun active(active: Boolean) = PredicateSpecification<OfferData> { root, criteriaBuilder ->
        criteriaBuilder.equal(root.get<Boolean>("active"), active)
    }

    fun from(from: LocalDate) = PredicateSpecification<OfferData> { root, criteriaBuilder ->
        criteriaBuilder.greaterThanOrEqualTo(root.get("start"), from.atStartOfDay())
    }


    fun to(to: LocalDate) = PredicateSpecification<OfferData> { root, criteriaBuilder ->
        criteriaBuilder.lessThan(root.get("start"), to.atStartOfDay().plusDays(1))
    }

}
