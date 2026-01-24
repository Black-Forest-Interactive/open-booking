package de.sambalmueslie.openbooking.core.editor.api

import de.sambalmueslie.openbooking.common.Entity
import java.time.LocalDateTime

data class Editor(
    override val id: Long,
    val resourceId: Long,
    val resourceType: String,
    val userId: String,
    val userName: String,
    var expires: LocalDateTime,
    override val created: LocalDateTime,
    override val updated: LocalDateTime?,
) : Entity<Long>