package de.sambalmueslie.openbooking.core.visitor.api

import de.sambalmueslie.openbooking.common.BusinessObject

data class Visitor(
    override val id: Long,
    val type: VisitorType,
    val title: String,
    val description: String,

    val size: Int,
    val minAge: Int,
    val maxAge: Int,

    val name: String,
    val address: Address,
    val phone: String,
    val email: String,

    val verification: Verification
) : BusinessObject<Long>
