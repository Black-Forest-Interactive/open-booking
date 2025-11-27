plugins {
    kotlin("jvm")
    kotlin("plugin.allopen")
    kotlin("plugin.jpa")
    kotlin("plugin.serialization")
    id("com.google.devtools.ksp")
    id("org.sonarqube")
    id("com.google.cloud.tools.jib")
    id("io.micronaut.application")
    id("io.micronaut.test-resources")
    id("io.micronaut.aot")
}

micronaut {
    runtime("netty")
    testRuntime("junit5")
    processing {
        incremental(true)
        annotations("de.sambalmueslie.openbooking.*")
    }
    aot {
        // Please review carefully the optimizations enabled below
        // Check https://micronaut-projects.github.io/micronaut-aot/latest/guide/ for more details
        optimizeServiceLoading = false
        convertYamlToJava = false
        precomputeOperations = true
        cacheEnvironment = true
        optimizeClassLoading = true
        deduceEnvironment = true
        optimizeNetty = true
        replaceLogbackXml = true
    }
}


dependencies {
    // keycloak
    implementation("org.keycloak:keycloak-common:26.4.6")
    implementation("org.keycloak:keycloak-core:26.4.6")

    // database
    ksp("io.micronaut.data:micronaut-data-processor")
    implementation("io.micronaut.data:micronaut-data-jdbc")
    runtimeOnly("org.postgresql:postgresql")
    implementation("io.micronaut.flyway:micronaut-flyway")

    // security
    aotPlugins("io.micronaut.security:micronaut-security-aot:4.15.0")

    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.testcontainers:postgresql")
    testImplementation("org.testcontainers:testcontainers")

    // velocity
    implementation("org.apache.velocity:velocity-engine-core:2.4.1")
    implementation("org.apache.velocity.tools:velocity-tools-generic:3.1")

    // FOP
    implementation("org.apache.xmlgraphics:fop:2.11")
    implementation("org.apache.xmlgraphics:xmlgraphics-commons:2.11")

    // OpenPDF
    implementation("com.github.librepdf:openpdf:3.0.0")
    implementation("org.xhtmlrenderer:flying-saucer-pdf:10.0.3")

    // qrcode
    implementation("com.google.zxing:core:3.5.3")
    implementation("com.google.zxing:javase:3.5.3")

    // POI
    implementation("org.apache.poi:poi:5.4.1")
    implementation("org.apache.poi:poi-ooxml:5.4.1")
    implementation("builders.dsl:spreadsheet-builder-poi:3.0.1")

    // mail
    implementation("org.simplejavamail:simple-java-mail:8.12.6")
    implementation("org.simplejavamail:batch-module:8.12.6")
    implementation("org.simplejavamail:authenticated-socks-module:8.12.6")
}

application {
    mainClass.set("de.sambalmueslie.openbooking.BookingApplication")
}

jib {
    from.image = "eclipse-temurin:21-jre-ubi9-minimal"
    to {
        image = "open-booking-backend"
        tags = setOf(version.toString(), "latest")
    }
    container {
        creationTime.set("USE_CURRENT_TIMESTAMP")

        jvmFlags = listOf(
            "-server",
            "-XX:+UseContainerSupport",
            "-XX:MaxRAMPercentage=75.0",

            // Java 21+ ZGC for better performance
            "-XX:+UseZGC",
            "-XX:+UnlockExperimentalVMOptions",

            "-XX:+TieredCompilation",
            "-Dmicronaut.runtime.environment=prod",
            "-Dio.netty.allocator.maxOrder=3"
        )

        user = "1001"

        environment = mapOf(
            "JAVA_TOOL_OPTIONS" to "-XX:+ExitOnOutOfMemoryError"
        )
    }
}