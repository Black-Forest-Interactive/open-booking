package de.sambalmueslie.openbooking.core.editor

import java.util.concurrent.atomic.AtomicLong

class EditorIdGenerator {

    private val sequence = AtomicLong(0)

    fun getId(): Long {
        return sequence.incrementAndGet()
    }

}