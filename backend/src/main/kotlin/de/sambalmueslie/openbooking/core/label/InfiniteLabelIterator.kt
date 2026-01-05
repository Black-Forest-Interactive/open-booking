package de.sambalmueslie.openbooking.core.label

import de.sambalmueslie.openbooking.core.label.api.Label

class InfiniteLabelIterator(private val labels: List<Label>) {

    private var index = 0

    fun reset() {
        this.index = 0
    }

    fun next(): Label? {
        if (labels.isEmpty()) return null
        val data = labels[this.index % this.labels.size]
        index++
        return data
    }

}