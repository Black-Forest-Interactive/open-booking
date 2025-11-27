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
    implementation("org.apache.velocity:velocity-engine-core:2.3")
    implementation("org.apache.velocity.tools:velocity-tools-generic:3.1")
    // FOP
    implementation("org.apache.xmlgraphics:fop:2.8")
    // POI
    implementation("org.apache.poi:poi:5.2.3")
    implementation("org.apache.poi:poi-ooxml:5.2.3")
    implementation("builders.dsl:spreadsheet-builder-poi:3.0.1")
    // mail
    implementation("org.simplejavamail:simple-java-mail:7.9.1")
    implementation("org.simplejavamail:batch-module:7.9.1")
    implementation("org.simplejavamail:authenticated-socks-module:7.9.1")
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