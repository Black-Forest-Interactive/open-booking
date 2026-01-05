package de.sambalmueslie.openbooking.common


import io.micronaut.test.annotation.MockBean
import io.mockk.mockk

abstract class BaseServiceTest {

    val mailClient = mockk<de.sambalmueslie.openbooking.infrastructure.mail.external.MailClient>()

    @MockBean(_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.external.MailClient::class)
    fun mailClient() = mailClient

    val timeProvider = mockk<TimeProvider>()

    @MockBean(TimeProvider::class)
    fun timeProvider() = timeProvider
}

