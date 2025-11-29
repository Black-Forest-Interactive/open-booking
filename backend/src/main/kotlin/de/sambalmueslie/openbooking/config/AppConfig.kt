package de.sambalmueslie.openbooking.config


import io.micronaut.context.annotation.ConfigurationProperties
import jakarta.validation.constraints.NotBlank
import org.slf4j.Logger
import org.slf4j.LoggerFactory


@ConfigurationProperties("app")
class AppConfig {

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(AppConfig::class.java)
    }

    @NotBlank
    var baseUrl: String = ""
        set(value) {
            logger.info("Set baseUrl from '$field' to '$value'")
            field = value
        }

}
