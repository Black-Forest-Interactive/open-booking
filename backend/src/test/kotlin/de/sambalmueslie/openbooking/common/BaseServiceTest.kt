package de.sambalmueslie.openbooking.common


import de.sambalmueslie.openbooking.backend.mail.external.MailClient
import io.micronaut.test.annotation.MockBean
import io.mockk.mockk

abstract class BaseServiceTest {

	val mailClient = mockk<MailClient>()
	@MockBean(MailClient::class)
	fun mailClient() = mailClient

	val timeProvider = mockk<TimeProvider>()

	@MockBean(TimeProvider::class)
	fun timeProvider() = timeProvider
}
