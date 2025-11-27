plugins {
    id("org.jetbrains.kotlin.jvm")
    id("org.jetbrains.kotlin.kapt")
    id("org.jetbrains.kotlin.plugin.allopen")
    id("org.sonarqube")
    id("com.google.cloud.tools.jib")
    id("io.micronaut.application")
}

micronaut {
    runtime("netty")
    testRuntime("junit5")
    processing {
        incremental(true)
        annotations("de.sambalmueslie.openevent.core.*")
    }
}


dependencies {
    // database
    kapt("io.micronaut.data:micronaut-data-processor")
    implementation("io.micronaut.data:micronaut-data-jdbc")
    runtimeOnly("org.postgresql:postgresql")
    implementation("io.micronaut.flyway:micronaut-flyway")

    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.testcontainers:postgresql")
    testImplementation("org.testcontainers:testcontainers")
    // velocity
    implementation("org.apache.velocity:velocity-engine-core:2.3")
    implementation("org.apache.velocity.tools:velocity-tools-generic:3.1")
    // FOP
    implementation("org.apache.xmlgraphics:fop:2.8")
    // POI
    implementation("org.apache.poi:poi:5.2.3")
    implementation("org.apache.poi:poi-ooxml:5.2.3")
    implementation("builders.dsl:spreadsheet-builder-poi:3.1.1.1")
    // mail
    implementation("org.simplejavamail:simple-java-mail:7.9.1")
    implementation("org.simplejavamail:batch-module:7.9.1")
    implementation("org.simplejavamail:authenticated-socks-module:7.9.1")
}

application {
    mainClass.set("de.sambalmueslie.openbooking.BookingApplication")
}

jib {
    from.image = "eclipse-temurin:18-jre-alpine"
    to {
        image = "iee1394/open-booking"
        tags = setOf(version.toString(), "latest")
    }
    container.creationTime.set("USE_CURRENT_TIMESTAMP")
}

