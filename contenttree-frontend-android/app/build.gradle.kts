plugins {
	alias(libs.plugins.android.application)
	alias(libs.plugins.kotlin.compose)
	alias(libs.plugins.kotlin.serialization)
	alias(libs.plugins.openapi.ktor.client.generator)
}

group = "rkrisztian.contenttree"
version = providers.fileContents(rootProject.layout.projectDirectory.file("../.version"))
	.asText.get().trim()

java {
	toolchain {
		languageVersion = provider {
			JavaLanguageVersion.of(
				providers.fileContents(rootProject.layout.projectDirectory.file(".java-version"))
					.asText.map { it.trim() }.get()
			)
		}
	}
}

android {
	namespace = "rkrisztian.contenttree"
	compileSdk {
		version = release(37)
	}

	defaultConfig {
		applicationId = "rkrisztian.contenttree"
		minSdk = 28
		targetSdk = 37
		versionCode = 1
		versionName = "1.0"

		testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
	}

	buildTypes {
		release {
			optimization {
				enable = false
			}
		}
	}
	compileOptions {
		sourceCompatibility = JavaVersion.VERSION_11
		targetCompatibility = JavaVersion.VERSION_11
	}
	buildFeatures {
		compose = true
	}
}

dependencies {
	implementation(platform(libs.androidx.compose.bom))
	implementation(libs.androidx.activity.compose)
	implementation(libs.androidx.compose.material3)
	implementation(libs.androidx.compose.ui)
	implementation(libs.androidx.compose.ui.graphics)
	implementation(libs.androidx.compose.ui.tooling.preview)
	implementation(libs.androidx.core.ktx)
	implementation(libs.androidx.lifecycle.runtime.ktx)
	implementation(libs.ktor.client.android)
	implementation(libs.ktor.serialization.kotlinx.json)
	implementation(libs.ktor.client.content.negotiation)
	implementation(libs.ktor.client.cio.jvm)
	implementation(libs.ktor.client.logging)
	testImplementation(libs.junit)
	androidTestImplementation(libs.androidx.compose.ui.test.junit4)
	androidTestImplementation(libs.androidx.espresso.core)
	androidTestImplementation(libs.androidx.junit)
	debugImplementation(libs.androidx.compose.ui.test.manifest)
	debugImplementation(libs.androidx.compose.ui.tooling)
}

apiClientGenerator {
	generators {
		create("openapi") {
			outputDirectory = layout.projectDirectory
			openApiFile = file("../../contenttree-backend/build/openapi.json")
			basePackage = "rkrisztian.contenttree.api"
		}
	}
}

tasks.named { it == "generateOpenapi" }.configureEach {
	// Do not run during regular build lifecycle (generated code is manually committed).
	enabled = providers.gradleProperty("enableGenerateOpenapi").orNull != null
}
