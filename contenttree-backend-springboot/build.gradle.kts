import net.ltgt.gradle.errorprone.errorprone
import net.ltgt.gradle.nullaway.nullaway
import org.gradle.api.tasks.testing.logging.TestLogEvent.FAILED
import org.gradle.api.tasks.testing.logging.TestLogEvent.SKIPPED

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

buildscript {
	configurations.all {
		// Temporary vulnerability fixes in transitive dependencies of plugins:
		resolutionStrategy.eachDependency {
			when (requested.run { "${group}:${name}" }) {
				// Syntax: `"GROUP:ARTIFACT" -> useVersion("VERSION")`
				"tools.jackson:jackson-bom" -> useVersion("3.1.7")
				else -> {}
			}
		}
	}
}

group = "contenttree"
version = providers.fileContents(layout.projectDirectory.file("../.version")).asText.get().trim()

tasks.wrapper {
	retries = 3
	retryBackOffMs = 1000
}

val javaVersion = providers.fileContents(layout.projectDirectory.file(".java-version"))
	.asText.map { it.trim() }

java {
	toolchain {
		languageVersion = provider { JavaLanguageVersion.of(javaVersion.get()) }
	}
}

repositories {
	mavenCentral()
}

val mockitoAgent = configurations.register("mockitoAgent")

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-webmvc")
	implementation(libs.springdocOpenapiStarterWebmvcUi)
	implementation(libs.mapstruct)
	implementation("org.springframework.boot:spring-boot-starter-liquibase")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation(libs.jjwtApi)

	runtimeOnly("org.postgresql:postgresql")
	runtimeOnly(libs.jjwtImpl)
	runtimeOnly(libs.jjwtJackson)
	annotationProcessor(libs.mapstructProcessor)
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	developmentOnly("org.springframework.boot:spring-boot-docker-compose")
	errorprone(libs.errorProneCore)
	errorprone(libs.nullaway)

	testImplementation("org.springframework.boot:spring-boot-starter-actuator-test")
	testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
	testImplementation("org.springframework.boot:spring-boot-testcontainers")
	testImplementation("org.testcontainers:testcontainers-junit-jupiter")
	testImplementation("org.testcontainers:testcontainers-postgresql")
	testImplementation("org.springframework.boot:spring-boot-starter-liquibase-test")
	testImplementation("org.springframework.boot:spring-boot-starter-security-test")

	testRuntimeOnly("org.junit.platform:junit-platform-launcher")

	mockitoAgent("org.mockito:mockito-core") { isTransitive = false }
}

// Temporary vulnerability fixes in non-Spring-Boot-managed transitive dependencies:
configurations.all {
	resolutionStrategy.eachDependency {
		when (requested.group) {
			// Syntax: `"GROUP" -> useVersion("VERSION")`
			"org.apache.tomcat.embed" -> useVersion("11.0.25")
			else -> {}
		}
		when (requested.run { "${group}:${name}" }) {
			// Syntax: `"GROUP:ARTIFACT" -> useVersion("VERSION")`
			"org.apache.commons:commons-lang3" -> useVersion("3.20.0")
			else -> {}
		}
	}
}

// Temporary vulnerability fixes in Spring-Boot-managed dependencies:
// See: https://docs.spring.io/spring-boot/appendix/dependency-versions/properties.html
// Syntax: `extra["ARTIFACT.version"] = "VERSION"`
extra["jackson-2-bom.version"] = "2.21.7"
extra["jackson-bom.version"] = "3.1.7"

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
				errorproneArgs.add("-Xep:JSpecifyUnrecognizedAnnotationLocation:WARN")
			}
		}
	}
}

nullaway {
	onlyNullMarked = true
	jspecifyMode = true
}

val devSpecificFiles = setOf(
	"contenttree/common/config/DocsConfig.class",
	"contenttree/common/config/OpenApiConfig.class",
	"application-dev.yaml",
	"application-docs.yaml"
)

tasks.jar {
	setExcludes(devSpecificFiles)
}

tasks.bootJar {
	setExcludes(devSpecificFiles)
	includeTools = false

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
	apiDocsUrl = "http://localhost:8083/v3/api-docs"
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
	val publishImage = providers.gradleProperty("publishImage")
		.map(String::toBoolean).orElse(false)

	// version: 0.0.197
	builder =
		"paketobuildpacks/builder-noble-java-tiny@sha256:b95da27fce97b58037f0c11ae934760c50730da4c9a24976205b53638592eba9"
	buildpacks = listOf(
		// version: 11.8.0
		"paketobuildpacks/azul-zulu@sha256:59d67e7548bcecf3943af95e89fd148425d752a00117aa4633789182fa465960",
		// version: 22.6.0
		"paketobuildpacks/java@sha256:ed37748a3696a0f4e2f48b6bb8a1696ce88f8f4b39e8fea0c20b3a2007c21512",
		// version: 2.14.0
		"paketobuildpacks/health-checker@sha256:bdf274d5407b17bbfbc8645f391efdec5cff50df33f64d8b56e60dc5a2720593"
	)
	environment.put("BP_JVM_VERSION", javaVersion)
	environment.putAll(
		mapOf(
			"BP_JVM_JLINK_ENABLED" to "true",
			"BP_JVM_JLINK_ARGS" to "--no-man-pages --no-header-files --strip-debug --compress zip-6 "
					// Spring Boot requires the "jdk.unsupported".
					+ "--add-modules java.base,java.desktop,java.compiler,java.management,java.logging,"
					+ "java.naming,java.security.jgss,java.instrument,java.sql,jdk.unsupported",
			"BP_HEALTH_CHECKER_ENABLED" to "true",
			"BPE_DELIM_JAVA_TOOL_OPTIONS" to " ",
			"BPE_APPEND_JAVA_TOOL_OPTIONS" to "-XX:MaxMetaspaceSize=256M",
		)
	)
	imageName = provider {
		if (publishImage.get()) {
			"ghcr.io/${
				providers.environmentVariable("GHCR_USER").get()
			}/contenttree-backend:${version}-snapshot"
		} else {
			"contenttree-backend:latest"
		}
	}
	publish = publishImage
}

@Suppress("UnstableApiUsage")  // No practical alternative is available.
testing {
	suites {
		withType<JvmTestSuite> {
			targets.all {
				testTask.configure {
					testLogging { lifecycle.events(SKIPPED); quiet.events(FAILED) }
					jvmArgs(
						"-javaagent:${mockitoAgent.get().asPath}",
						// Disable CDS to silence "Sharing is only supported for boot loader classes..."
						// warning, caused by agents (e.g., JaCoCo) appending to the bootstrap classpath.
						"-Xshare:off"
					)

					finalizedBy("codeCoverageReport")
				}
			}
		}

		named<JvmTestSuite>("test") {
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

tasks.check {
	@Suppress("UnstableApiUsage")
	dependsOn(testing.suites.named("integrationTest"))
}

@Suppress("UnstableApiUsage")
reporting {
	reports {
		create<JacocoCoverageReport>("codeCoverageReport") {
			testSuiteName = "all"

			reportTask.configure {
				executionData(
					tasks.withType<Test>()
						.map { it.extensions.getByType<JacocoTaskExtension>().destinationFile }
				)

				classDirectories.setFrom(
					sourceSets.main.get().output.classesDirs.map { dir ->
						fileTree(dir).exclude(
							"contenttree/common/config/DocsConfig.class",
							"contenttree/common/config/OpenApiConfig.class",
							"contenttree/tree/ContentTreeMapperImpl.class",
							"contenttree/auth/AuthMapperImpl.class"
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
		property("sonar.coverage.exclusions", listOf("**/DocsConfig.java", "**/OpenApiConfig.java"))
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
		property(
			"sonar.java.pmd.reportPaths",
			layout.buildDirectory.file("reports/pmd/main.xml").get().asFile
		)

		property("sonar.issue.ignore.multicriteria", "oldDate")
		// I am using legacy API (jjwt). See: https://github.com/jwtk/jjwt/issues/235
		property("sonar.issue.ignore.multicriteria.oldDate.ruleKey", "java:S2143")
		property("sonar.issue.ignore.multicriteria.oldDate.resourceKey", "**/JwtService.java")
	}
}

tasks.sonar {
	dependsOn(tasks.build)
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
