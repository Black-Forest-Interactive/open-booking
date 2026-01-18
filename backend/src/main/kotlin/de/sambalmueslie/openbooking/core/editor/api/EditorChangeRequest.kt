package de.sambalmueslie.openbooking.core.editor.api

import de.sambalmueslie.openbooking.common.EntityChangeRequest
import kotlin.reflect.KClass

data class EditorChangeRequest(
    val resourceId: Long,
    val resourceType: KClass<*>,
    val userId: String,
    val userName: String,
) : EntityChangeRequest
