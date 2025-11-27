package de.sambalmueslie.openbooking.common

import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.assertEquals


class PageableIteratorTest {


    @Test()
    fun testPageableIterator() {
        val pageSize = 4
        val pages = listOf(
            Page.of(listOf("A", "B", "C", "D"), Pageable.from(0, pageSize), (pageSize * 3).toLong()),
            Page.of(listOf("E", "F", "G", "H"), Pageable.from(1, pageSize), (pageSize * 3).toLong()),
            Page.of(listOf("I", "J", "K", "L"), Pageable.from(2, pageSize), (pageSize * 3).toLong()),
        )

        val sequence = PageableSequence(pageSize) { pages[it.number] }

        val result = sequence.joinToString("") { it }
        assertEquals("ABCDEFGHIJKL", result)
    }
}
