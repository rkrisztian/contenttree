[![CI Pipeline](https://github.com/rkrisztian/contenttree/actions/workflows/ci.yml/badge.svg)](https://github.com/rkrisztian/contenttree/actions/workflows/ci.yml)
Backend: [![Backend Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=contenttree-backend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=contenttree-backend)
Frontend (Angular):
[![Frontend Quality Gate Status (Angular)](https://sonarcloud.io/api/project_badges/measure?project=contenttree-frontend-angular&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=contenttree-frontend-angular)\
Frontend (Next.js):
[![Frontend Quality Gate Status (Next.js)](https://sonarcloud.io/api/project_badges/measure?project=contenttree-frontend-nextjs&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=contenttree-frontend-nextjs)

# Content Tree Management App

A hands-on project demonstrating full-stack development skills, originally built as a home
assignment and later expanded.

This app manages content trees. You can add, delete, edit tree nodes and their contents, move nodes
to another parent, as well as search nodes by name or content.

## Used technology stack

The app consists of a Spring Boot backend, an Angular and Next.js frontends.

<table>
	<tr>
		<th>&nbsp;</th>
		<th>Main Dependencies</th>
		<th>Quality & Testing</th>
	</tr>
	<tr>
		<th>Backend</th>
		<td>
			<ul>
				<li><a href="https://spring.io/projects/spring-boot">Spring Boot</a> (REST API)</li>
				<li><a href="https://gradle.org/">Gradle</a> (build tool)</li>
				<li><a href="https://www.postgresql.org/">PostgreSQL</a> (database)</li>
				<li><a href="https://mapstruct.org/">MapStruct</a> (DTO mapping)</li>
				<li><a href="https://github.com/jwtk/jjwt">JJWT</a> (authentication)</li>
				<li><i>(Optional)</i> <a href="https://www.dbgate.io/">DbGate</a> (database manager)</li>
			</ul>
		</td>
		<td>
			<ul>
				<li><a href="https://testcontainers.com/">Testcontainers</a> (integration testing)</li>
				<li><a href="https://github.com/uber/NullAway">NullAway</a> (null safety checker)</li>
				<li><a href="https://pmd.github.io/">PMD</a> (code linting)</li>
			</ul>
		</td>
	</tr>
	<tr>
		<th>Frontend (Angular)</th>
		<td>
			<ul>
				<li><a href="https://angular.dev/">Angular</a> (component-based UI)</li>
				<li><a href="https://material.angular.dev/">Angular Material</a> (UI components)</li>
			</ul>
		</td>
		<td>
			<ul>
				<li><a href="https://eslint.org/">ESLint</a> (code linting)</li>
				<li><a href="https://prettier.io/">Prettier</a> (code formatting)</li>
			</ul>
		</td>
	</tr>
	<tr>
		<th>Frontend (Next.js)</th>
		<td>
			<ul>
				<li><a href="https://nextjs.org/">Next.js</a> (React framework)</li>
				<li><a href="https://mui.com/">MUI</a> (UI components)</li>
			</ul>
		</td>
		<td>
			<ul>
				<li><a href="https://biomejs.dev/">Biome</a> (code linting and formatting)</li>
				<li><a href="https://vitest.dev/">Vitest</a> (testing framework)</li>
			</ul>
		</td>
	</tr>
</table>

- **Common Technologies:**
	- **Main Dependencies:**
		- [OpenAPI Typescript Codegen](https://github.com/ferdikoomen/openapi-typescript-codegen)
		  (type-safe API interactions) ([to be migrated to
		  `@hey-api/openapi-ts`](https://github.com/rkrisztian/contenttree/issues/120))
	- **CI/CD & Quality:**
		- [GitHub](https://github.com/) (repository hosting, CI/CD & dependency management)
		- [SonarQube Cloud](https://www.sonarsource.com/products/sonarqube/cloud/) (code quality &
		  security analysis)
		- [Playwright](https://playwright.dev/) (end-to-end testing)

## Running the Application

### Prerequisites

- **Backend:**
	- [Java Development Kit](https://www.java.com/en/) 25 or later
	- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
	- _(Optional)_ [GNG](https://github.com/gdubw/gng) (provides the `gw` command)
- **Frontend (Angular and Next.js):**
	- [Node.js](https://nodejs.org/en)
	  and [npm](https://nodejs.org/learn/node-api/getting-started/tools#npm)

You can install Java and Node.js using
[a version manager of your choice](https://github.com/bernardoduarte/awesome-version-managers).

The backend application (when using the `dev` profile) and the integration tests automatically pull
the PostgreSQL database image. To enable this, ensure that you are logged in to
the [Docker Hardened Images distribution registry](https://hub.docker.com/hardened-images/catalog):

```bash
docker login dhi.io
```

### Backend

Navigate to the backend project folder and start the Spring Boot application. This command also
triggers Docker Compose to start the PostgreSQL database defined in `compose.yaml`.

```bash
cd contenttree-backend
gw bootRun
```

The `bootRun` task defaults to the `dev` profile if no other profile is explicitly set via
environment variable (`SPRING_PROFILES_ACTIVE`) or command-line arguments
(`--spring.profiles.active=prod`). You can override this default in your IDE's Run Configuration.

Once the backend is running, the API documentation is available at
[http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html). The Actuator can be
accessed at `http://localhost:8082/actuator/<endpoint>`, e.g.,
[http://localhost:8082/actuator/health](http://localhost:8082/actuator/health).

If you do not have IntelliJ IDEA Ultimate edition and you need a database manager tool, you can view
and manage the `contenttree` database content via the DbGate UI
at [http://localhost:5433/](http://localhost:5433/) after running the `bootRun` task the following
way:

```shell
cd contenttree-backend
gw bootRun --args='--spring.docker.compose.profiles.active=debug'
```

### Frontend (Angular)

Navigate to the `contenttree-frontend-angular` folder and start the Angular development server.

```shell
cd contenttree-frontend-angular
npm ci
npm start
```

This runs the development web server. Once the frontend is running, the application will be
available at [http://localhost:4200/tree](http://localhost:4200/tree).

### Frontend (Next.js)

Navigate to the `contenttree-frontend-nextjs` folder and start the Angular development server.

```shell
cd contenttree-frontend-nextjs
npm ci
npm run dev
```

This runs the development web server. Once the frontend is running, the application will be
available at [http://localhost:3000/tree](http://localhost:3000/tree).

### Authentication

See [`002_test-data.sql`](contenttree-backend/src/main/resources/db/changelog/002_test-data.sql)
for test users with different roles. The passwords for these users were generated using
[`BCryptPasswordEncoder`](https://www.baeldung.com/linux/bcrypt-hash).

## Deploying the Application

To test the application in a production-like deployment, it is possible to create a deployment on
the local machine by executing the following commands:

```shell
(cd contenttree-backend && gw bootBuildImage)
(cd contenttree-frontend-angular && npm run build:docker)
(cd contenttree-frontend-nextjs && npm run build:docker)
(cd contenttree-deploy && docker compose up)
```

The files in `contenttree-deploy/etc` contain default credentials for local development convenience
only.

## Running Tests

### Backend Tests

Execute backend tests (including integration tests) using Gradle:

```shell
cd contenttree-backend
gw check
```

The `check` task depends on the `integrationTest` suite.

### Frontend Tests (Angular)

Execute unit and integration tests using npm:

```shell
cd contenttree-frontend-angular
npm test
```

Component tests are executed separately because they require a browser (this project uses Chromium):

```shell
cd contenttree-frontend-angular
npm run install:chromium
npm run test:ct
```

### Frontend Tests (Nextjs)

Execute unit and integration tests using npm:

```shell
cd contenttree-frontend-nextjs
npm test
```

Component tests are executed separately because they require a browser (this project uses Chromium):

```shell
cd contenttree-frontend-nextjs
npm run install:chromium
npm run test:ct
```

### End-to-End Tests

To run E2E tests, be sure that you have executed the aforementioned production-like deployment.

```shell
cd contenttree-deploy/e2e
npm ci
npm run install:chromium
npm test
```

## Contribution

The following IDEs are recommended for use:

- **Backend:**
	- [IntelliJ IDEA](https://www.jetbrains.com/idea/) (with or without the Ultimate subscription)
- **Frontend (Angular & Next.js):**
	- [Visual Studio Code](https://code.visualstudio.com/)

### Backend

#### Changing build dependencies

You can change dependencies (e.g., update dependency versions) by running the following commands:

```shell
cd contenttree-backend
gw build --write-verification-metadata pgp,sha256 --export-keys --write-locks
```

Then review the changes in the verification metadata and the lock file.

### Frontend (Angular and Next.js) and E2E Tests

#### Backend API Type Generation

To generate TypeScript types, run the following commands:

```shell
(cd contenttree-backend && gw generateOpenApiDocs)
(cd contenttree-frontend-angular && npm run openapi:generate)
(cd contenttree-frontend-nextjs && npm run openapi:generate)
(cd contenttree-deploy/e2e && npm run openapi:generate)
```

**Note:** `generateOpenApiDocs` is a standalone task because it is incompatible with Gradle's
configuration cache.
