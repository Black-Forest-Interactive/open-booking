package de.sambalmueslie.openbooking.core.editor.api

import de.sambalmueslie.openbooking.common.Entity
import java.time.LocalDateTime

data class Editor(
    override val id: Long,
    val resourceId: Long,
    val resourceType: String,
    val userId: String,
    val userName: String,
    val startedAt: LocalDateTime,
    var expires: LocalDateTime
) : Entity<Long>