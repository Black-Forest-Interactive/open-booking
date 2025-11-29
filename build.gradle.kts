import org.jetbrains.kotlin.gradle.dsl.JvmTarget
plugins {
    kotlin("jvm") version "2.2.21"
    kotlin("plugin.allopen") version "2.2.21"
    kotlin("plugin.jpa") version "2.2.21"
    kotlin("plugin.serialization") version "2.2.21"
    id("com.google.devtools.ksp") version "2.3.2"
    id("org.sonarqube") version "7.1.0.6387"
    id("net.researchgate.release") version "3.1.0"
    id("com.google.cloud.tools.jib") version "3.4.5"
    id("io.micronaut.application") version "4.6.1"
    id("io.micronaut.test-resources") version "4.6.1"
    id("io.micronaut.aot") version "4.6.1"
    id("maven-publish")
    id("jacoco")
}

repositories {
    mavenCentral()
}

subprojects {

    apply(plugin = "org.jetbrains.kotlin.jvm")
    apply(plugin = "io.micronaut.application")
    apply(plugin = "com.google.devtools.ksp")
    apply(plugin = "org.gradle.jacoco")

    repositories {
        mavenCentral()
    }

    dependencies {
        implementation("ch.qos.logback:logback-classic:1.5.20")
        runtimeOnly("org.yaml:snakeyaml")

        testImplementation("org.junit.jupiter:junit-jupiter-api:6.0.1")
        testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:6.0.1")
        testImplementation("io.mockk:mockk:1.14.6")

        // jackson
        ksp("io.micronaut.serde:micronaut-serde-processor")
        implementation("io.micronaut:micronaut-jackson-databind")
//    implementation("io.micronaut.serde:micronaut-serde-jackson")
        implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
        implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")

        // http
        ksp("io.micronaut:micronaut-http-validation")
        compileOnly("io.micronaut:micronaut-http-client")

        // validation
        implementation("jakarta.validation:jakarta.validation-api")
        ksp("io.micronaut.validation:micronaut-validation-processor")
        implementation("io.micronaut.validation:micronaut-validation")

        // openapi
        ksp("io.micronaut.openapi:micronaut-openapi")
        compileOnly("io.micronaut.openapi:micronaut-openapi-annotations")
        implementation("io.swagger.core.v3:swagger-annotations")

        // security
        ksp("io.micronaut.security:micronaut-security-annotations")
        implementation("io.micronaut.security:micronaut-security")
        implementation("io.micronaut.security:micronaut-security-jwt")
        implementation("io.micronaut.security:micronaut-security-oauth2")


        // kotlin
        implementation("io.micronaut.kotlin:micronaut-kotlin-extension-functions")
        implementation("io.micronaut.kotlin:micronaut-kotlin-runtime")
        implementation("org.jetbrains.kotlin:kotlin-reflect:2.2.21")
        implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:2.2.21")

        // caching
        implementation("com.github.ben-manes.caffeine:caffeine:3.2.3")

        // coroutines
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.2")
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactive:1.10.2")
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor:1.10.2")

        // reactor
        implementation("io.micronaut.reactor:micronaut-reactor")
        implementation("io.micronaut.reactor:micronaut-reactor-http-client")

        // data
        ksp("io.micronaut.data:micronaut-data-processor")
        implementation("io.micronaut.data:micronaut-data-jdbc")
        implementation("io.micronaut.flyway:micronaut-flyway")
        runtimeOnly("org.flywaydb:flyway-database-postgresql")
        implementation("io.micronaut.sql:micronaut-jdbc-hikari")
        runtimeOnly("org.postgresql:postgresql")

    }

    java {
        sourceCompatibility = JavaVersion.VERSION_21
    }

    tasks {
        compileKotlin {
            compilerOptions {
                jvmTarget.set(JvmTarget.JVM_21)
            }
        }

        compileTestKotlin {
            compilerOptions {
                jvmTarget.set(JvmTarget.JVM_21)
            }
        }
    }


    tasks.test {
        useJUnitPlatform()
        jvmArgs = listOf(
            "-XX:+UnlockExperimentalVMOptions",
            "-XX:+UseParallelGC"
        )
        finalizedBy(tasks.jacocoTestReport)
    }
    tasks.jacocoTestReport {
        dependsOn(tasks.test)
        reports {
            xml.required.set(true)
            csv.required.set(false)
        }
    }
    jacoco {
        toolVersion = "0.8.13"
    }

    sonar {
        properties {
            property("sonar.projectKey", "Black-Forest-Interactive_open-booking")
            property("sonar.organization", "black-forest-interactive")
        }
    }




}

tasks.test {
    useJUnitPlatform()
    finalizedBy(tasks.jacocoTestReport)
}
tasks.jacocoTestReport {
    dependsOn(tasks.test)
    reports {
        xml.required.set(true)
        csv.required.set(false)
    }
}



