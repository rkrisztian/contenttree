import net.ltgt.gradle.errorprone.errorprone
import net.ltgt.gradle.nullaway.nullaway

plugins {
	java
	alias(libs.plugins.springframeworkBoot)
	alias(libs.plugins.springDependencyManagement)
	alias(libs.plugins.openapiGradlePlugin)
	alias(libs.plugins.netLtgt.errorprone)
	alias(libs.plugins.netLtgt.nullaway)
	pmd
	id("jacoco-report-aggregation")
	alias(libs.plugins.sonarqube)
}

group = "contenttree"
version = "0.0.1-SNAPSHOT"

tasks.wrapper {
	retries = 3
	retryBackOffMs = 1000
}

java {
	toolchain {
		languageVersion =
			JavaLanguageVersion.of(file(".java-version").readText(Charsets.UTF_8).trim())
	}
}

repositories {
	mavenCentral()
}

val mockitoAgent by configurations.registering

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-webmvc")
	implementation(libs.springdocOpenapiStarterWebmvcUi)
	implementation(libs.mapstruct)
	implementation("org.springframework.boot:spring-boot-starter-liquibase")

	annotationProcessor(libs.mapstructProcessor)
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	developmentOnly("org.springframework.boot:spring-boot-docker-compose")
	runtimeOnly("org.postgresql:postgresql")
	errorprone(libs.errorProneCore)
	errorprone(libs.nullaway)

	testImplementation("org.springframework.boot:spring-boot-starter-actuator-test")
	testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
	testImplementation("org.springframework.boot:spring-boot-testcontainers")
	testImplementation("org.testcontainers:testcontainers-junit-jupiter")
	testImplementation("org.testcontainers:testcontainers-postgresql")
	testImplementation("org.springframework.boot:spring-boot-starter-liquibase-test")

	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	mockitoAgent("org.mockito:mockito-core") { isTransitive = false }
}

// Temporary fixes for vulnerabilities in transitive dependencies:
configurations.all {
	resolutionStrategy.eachDependency {
		if (requested.group == "org.apache.tomcat.embed") {
			useVersion("11.0.22")
		}
	}
}

// Temporary fixes for vulnerabilities in direct dependencies:
extra["postgresql.version"] = "42.7.11"

dependencyLocking {
	lockAllConfigurations()
}

tasks.withType<JavaCompile>().configureEach {
	with(options) {
		encoding = "UTF-8"
		compilerArgs = listOf(
			"-Amapstruct.suppressGeneratorTimestamp=true",
			"-Xlint:deprecation"
		)
		errorprone {
			disableWarningsInGeneratedCode = true
			nullaway {
				error()
				checkOptionalEmptiness = true
				treatGeneratedAsUnannotated = true
				warnOnGenericInferenceFailure = true
				assertsEnabled = true
				handleTestAssertionLibraries = true
			}
		}
	}
}

nullaway {
	onlyNullMarked = true
	jspecifyMode = true
}

val devSpecificFiles = setOf(
	"contenttree/config/DocsConfig*.class",
	"application-dev.yaml",
	"application-docs.yaml"
)

tasks.jar {
	setExcludes(devSpecificFiles)
}

tasks.bootJar {
	setExcludes(devSpecificFiles)

	manifest {
		attributes(
			"Implementation-Title" to project.name,
			"Implementation-Version" to project.version,
			"License" to "MIT",
			"License-Url" to "https://opensource.org/licenses/MIT"
		)
	}
}

tasks.bootRun {
	if (!providers.environmentVariable("SPRING_PROFILES_ACTIVE").isPresent) {
		systemProperty(
			"spring.profiles.active",
			providers.systemProperty("spring.profiles.active").getOrElse("dev")
		)
	}
}

openApi {
	customBootRun {
		systemProperties.put("spring.profiles.active", "docs")
	}
}

// Workaround for issue: https://github.com/springdoc/springdoc-openapi-gradle-plugin/issues/166
listOf(
	"generateOpenApiDocs",
	"forkedSpringBootRun",
	"forkedSpringBootStop"
).forEach { taskName ->
	tasks.named(taskName) {
		notCompatibleWithConfigurationCache("The springdoc plugin is not compatible with the configuration cache.")
	}
}

tasks.bootBuildImage {
	imageName = "contenttree-backend:latest"
}

@Suppress("UnstableApiUsage")  // No practical alternative is available.
testing {
	suites {
		withType<JvmTestSuite> {
			targets.all {
				testTask.configure {
					testLogging { events("skipped", "failed") }
					jvmArgs("-javaagent:${mockitoAgent.get().asPath}")

					finalizedBy("codeCoverageReport")
				}
			}
		}

		@Suppress("unused")
		val test by getting(JvmTestSuite::class) {
			useJUnitJupiter()
		}

		register<JvmTestSuite>("integrationTest") {
			dependencies {
				implementation(project())
				implementation(configurations.named("testCompileClasspath").get())
			}

			targets.all {
				testTask.configure {
					inputs.files(".env", ".env.local")
					systemProperty("java.io.tmpdir", "${layout.buildDirectory.dir("tmp").get()}")
				}
			}
		}
	}
}

@Suppress("UnstableApiUsage")
tasks.check {
	dependsOn(testing.suites.named("integrationTest"))
}

@Suppress("UnstableApiUsage")
reporting {
	reports {
		@Suppress("unused")
		val codeCoverageReport by creating(JacocoCoverageReport::class) {
			testSuiteName = "all"

			reportTask.configure {
				executionData(
					tasks.withType<Test>()
						.map { it.extensions.getByType<JacocoTaskExtension>().destinationFile }
				)

				classDirectories.setFrom(
					sourceSets.main.get().output.classesDirs.map { dir ->
						fileTree(dir).exclude(
							"contenttree/config/DocsConfig.class"
						)
					}
				)

				reports {
					html.required = true
					xml.required = true
				}
			}
		}
	}
}

pmd {
	toolVersion = libs.versions.pmd.get()
	ruleSetFiles = files("pmd-ruleset.xml")
	ruleSets = listOf()
}

sonar {
	properties {
		val testTasks = tasks.withType<Test>().map { it.name }

		property("sonar.projectKey", "contenttree-backend")
		property("sonar.organization", "rkrisztian")
		property("sonar.projectName", "contenttree-backend")
		property("sonar.coverage.exclusions", "**/DocsConfig.java")
		property("sonar.tests", testTasks.flatMap { sourceSets[it].allSource.srcDirs }.toSet())
		property(
			"sonar.java.test.binaries",
			testTasks.flatMap { sourceSets[it].output.classesDirs.files }.toSet()
		)
		property(
			"sonar.java.test.libraries",
			testTasks.flatMap { sourceSets[it].compileClasspath.files }.toSet()
		)
		property(
			"sonar.junit.reportPaths",
			testTasks.map {
				tasks.named<Test>(it).get().reports.junitXml.outputLocation.get().asFile
			})
		property(
			"sonar.coverage.jacoco.xmlReportPaths",
			tasks.named<JacocoReport>("codeCoverageReport")
				.get().reports.xml.outputLocation.get().asFile
		)
	}
}

listOf(
	"pmdTest",
	"pmdIntegrationTest",
	"testCodeCoverageReport",
	"integrationTestCodeCoverageReport",
	"jacocoTestReport",
	"jacocoTestCoverageVerification"
).forEach {
	tasks.named(it) {
		enabled = false
		// Hide from regular task list
		group = null
	}
}
