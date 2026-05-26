import net.ltgt.gradle.errorprone.errorprone
import net.ltgt.gradle.nullaway.nullaway
import org.springframework.boot.gradle.tasks.bundling.BootJar
import org.springframework.boot.gradle.tasks.bundling.BootWar
import org.springframework.boot.gradle.tasks.run.BootRun

plugins {
	java
	war
	alias(libs.plugins.springframeworkBoot)
	alias(libs.plugins.springDependencyManagement)
	alias(libs.plugins.openapiGradlePlugin)
	alias(libs.plugins.netLtgt.errorprone)
	alias(libs.plugins.netLtgt.nullaway)
	pmd
	id("jacoco-report-aggregation")
}

group = "contenttree"
version = "0.0.1-SNAPSHOT"

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
	runtimeOnly("org.postgresql:postgresql")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-webmvc")
	implementation(libs.springdocOpenapiStarterWebmvcUi)
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	developmentOnly("org.springframework.boot:spring-boot-docker-compose")
	providedRuntime("org.springframework.boot:spring-boot-starter-tomcat-runtime")
	implementation(libs.mapstruct)
	annotationProcessor(libs.mapstructProcessor)
	implementation("org.springframework.boot:spring-boot-starter-liquibase")
	errorprone(libs.errorProneCore)
	errorprone(libs.nullaway)

	testImplementation("org.springframework.boot:spring-boot-starter-actuator-test")
	testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
	testImplementation("org.springframework.boot:spring-boot-testcontainers")
	testImplementation("org.testcontainers:testcontainers-junit-jupiter")
	testImplementation("org.testcontainers:testcontainers-postgresql")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	mockitoAgent("org.mockito:mockito-core") { isTransitive = false }
	testImplementation("org.springframework.boot:spring-boot-starter-liquibase-test")
}

tasks.withType<JavaCompile>().configureEach {
	options.compilerArgs = listOf(
		"-Amapstruct.suppressGeneratorTimestamp=true",
		"-Xlint:deprecation"
	)
	options.errorprone {
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

nullaway {
	onlyNullMarked = true
	jspecifyMode = true
}

val devSpecificFiles = setOf(
	"contenttree/config/DocsConfig*.class",
	"application-dev.yaml",
	"application-docs.yaml"
)

tasks.named<Jar>("jar") {
	setExcludes(devSpecificFiles)
}

tasks.named<BootJar>("bootJar") {
	setExcludes(devSpecificFiles)
}

tasks.named<War>("war") {
	rootSpec.setExcludes(devSpecificFiles)
}

tasks.named<BootWar>("bootWar") {
	rootSpec.setExcludes(devSpecificFiles)

	manifest {
		attributes(
			"Implementation-Title" to project.name,
			"Implementation-Version" to project.version,
			"License" to "MIT",
			"License-Url" to "https://opensource.org/licenses/MIT"
		)
	}
}

tasks.named<BootRun>("bootRun") {
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
tasks.named("check") {
	dependsOn(testing.suites.named("integrationTest"))
}

@Suppress("UnstableApiUsage")
reporting {
	reports {
		val codeCoverageReport by creating(JacocoCoverageReport::class) {
			testSuiteName = "all"

			reportTask.configure {
				// Workaround for not being able to use `executionData(tasks.withType(Test))`,
				// see https://github.com/gradle/gradle/issues/23223 and https://github.com/gradle/gradle/issues/26668
				executionData(provider {
					files(tasks.named { it in arrayOf("test", "integrationTest") })
						.filter { it.name.endsWith(".exec") && it.exists() }
						.files
				})

				classDirectories.setFrom(
					sourceSets.main.get().output.classesDirs.map { dir ->
						fileTree(dir).exclude(
							"contenttree/config/DocsConfig.class"
						)
					}
				)

				reports {
					html.required = true
					xml.required = false
				}
			}
		}
	}
}

pmd {
	ruleSetFiles = files("pmd-ruleset.xml")
	ruleSets = listOf()
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
