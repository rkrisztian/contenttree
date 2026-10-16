[![CI Pipeline](https://github.com/rkrisztian/contenttree/actions/workflows/ci.yml/badge.svg)](https://github.com/rkrisztian/contenttree/actions/workflows/ci.yml)
Backend (Spring Boot):
[![Backend Quality Gate Status (Spring Boot)](https://sonarcloud.io/api/project_badges/measure?project=contenttree-backend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=contenttree-backend)
Backend (NestJS):
[![Backend Quality Gate Status (NestJS)](https://sonarcloud.io/api/project_badges/measure?project=contenttree-backend-nestjs&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=contenttree-backend-nestjs)
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

The app consists of a Spring Boot and NestJS backend, an Angular and Next.js frontends.

> [!NOTE]
> The NestJS backend is in its early phase of development, and misses a few features and deployment
integrations.

<table>
	<tr>
		<th>&nbsp;</th>
		<th>Main Dependencies</th>
		<th>Quality & Testing</th>
	</tr>
	<tr>
		<th>Backend (Spring Boot)</th>
		<td>
			<ul>
				<li><a href="https://spring.io/projects/spring-boot">Spring Boot</a> (REST API)</li>
				<li><a href="https://gradle.org/">Gradle</a> (build tool)</li>
				<li><a href="https://mapstruct.org/">MapStruct</a> (DTO mapping)</li>
				<li><a href="https://github.com/jwtk/jjwt">JJWT</a> (authentication)</li>
				<li><i>(Optional)</i> <a href="https://www.dbgate.io/">DbGate</a> (database manager)</li>
			</ul>
		</td>
		<td>
			<ul>
				<li><a href="https://github.com/uber/NullAway">NullAway</a> (null safety checker)</li>
				<li><a href="https://pmd.github.io/">PMD</a> (code linting)</li>
			</ul>
		</td>
	</tr>
	<tr>
		<th>Backend (NestJS)</th>
		<td>
			<ul>
				<li><a href="https://github.com/nestjs/nest">NestJS</a> (REST API)</li>
			</ul>
		</td>
		<td>
			<ul>
			</ul>
		</td>
	</tr>
	<tr>
		<th>Frontend (Angular)</th>
		<td>
			<ul>
				<li><a href="https://angular.dev/">Angular</a> (component-based UI)</li>
				<li><a href="https://material.angular.dev/">Angular Material</a> (UI components)</li>
				<li><a href="https://ngx-translate.org/">ngx-translate</a> (I18n)</li>
			</ul>
		</td>
		<td>
			<ul>
				<li><a href="https://eslint.org/">ESLint</a> (code linting)</li>
			</ul>
		</td>
	</tr>
	<tr>
		<th>Frontend (Next.js)</th>
		<td>
			<ul>
				<li><a href="https://nextjs.org/">Next.js</a> (React framework)</li>
				<li><a href="https://mui.com/">MUI</a> (UI components)</li>
				<li><a href="https://github.com/i18next/next-i18next">next-i18next</a> (I18n)</li>
			</ul>
		</td>
		<td>
			<ul>
				<li><a href="https://oxc.rs/">Oxlint</a> (code linting)</li>
			</ul>
		</td>
	</tr>
	<tr>
		<th>Common</th>
		<td>
			<ul>
				<li><a href="https://www.postgresql.org/">PostgreSQL</a> (database)</li>
				<li><a href="https://github.com/ferdikoomen/openapi-typescript-codegen">OpenAPI
					Typescript Codegen</a> (type-safe API interactions)
					(<a href="https://github.com/rkrisztian/contenttree/issues/120">to be migrated
					to `@hey-api/openapi-ts`</a>)</li>
			</ul>
		</td>
		<td>
			<ul>
				<li><a href="https://vitest.dev/">Vitest</a> (testing framework)</li>
				<li><a href="https://testcontainers.com/">Testcontainers</a> (integration testing)</li>
				<li><a href="https://mswjs.io/">Mock Service Worker</a> (API mocking)</li>
				<li><a href="https://playwright.dev/">Playwright</a> (end-to-end testing)</li>
				<li><a href="https://prettier.io/">Prettier</a> (code formatting)</li>
				<li><a href="https://www.sonarsource.com/products/sonarqube/cloud/">SonarQube
					Cloud</a> (code quality & security analysis)</li>
			</ul>
		</td>
	</tr>
</table>

## Running the Application

### Prerequisites

- **Backend (Spring Boot):**
	- [Java Development Kit](https://www.java.com/en/) 25 or later
	- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
	- _(Optional)_ [GNG](https://github.com/gdubw/gng) (provides the `gw` command)
- **Backend (NestJS) and Frontend (Angular and Next.js):**
	- [Node.js](https://nodejs.org/en)
	  and [npm](https://nodejs.org/learn/node-api/getting-started/tools#npm)

You can install Java and Node.js using
[a version manager of your choice](https://github.com/bernardoduarte/awesome-version-managers). This
project was developed with [jenv](https://www.jenv.be/) and [nvs](https://github.com/jasongin/nvs).

The Spring Boot backend (when using the `dev` profile), the NestJS backend, and the integration
tests automatically pull the PostgreSQL database image. To enable this, ensure that you are logged
in to
the [Docker Hardened Images distribution registry](https://hub.docker.com/hardened-images/catalog):

```bash
docker login dhi.io
```

### Backend (Spring Boot)

Navigate to the `contenttree-backend` folder and start the Spring Boot application. This command
also triggers Docker Compose to start the PostgreSQL database defined in `compose.yaml`.

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

### Backend (NestJS)

Navigate to the `contenttree-backend-nestjs` folder and start the NestJS application. This command
also triggers Docker Compose to start the PostgreSQL database defined in `compose.yaml`.

```bash
cd contenttree-backend-nestjs
npm run start
```

Once the backend is running, the API documentation is available at
[http://localhost:3000/api](http://localhost:3000/api).

If you need a database manager tool, you can view and manage the `contenttree` database content via
the DbGate UI at [http://localhost:5433/](http://localhost:5433/) after running the backend the
following way:

```shell
cd contenttree-backend
COMPOSE_PROFILES=debug npm run start
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

For test users with different roles, see the following files:

* Spring Boot backend:
  [`002_test-data.sql`](contenttree-backend/src/main/resources/db/changelog/002_test-data.sql)
* NestJS backend:
  [`002_test-data.ts`](contenttree-backend-nestjs/src/migrations/002_test-data.ts)

The passwords for these users were generated using BCrypt:

* Spring Boot backend: [`BCryptPasswordEncoder`](https://www.baeldung.com/linux/bcrypt-hash)
* NestJS backend: [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

## Deploying the Application

To test the application in a production-like deployment, it is possible to create a deployment on
the local machine by executing the following commands:

```shell
(cd contenttree-backend && gw bootBuildImage)
(cd contenttree-backend-nestjs && npm run build:docker)
(cd contenttree-frontend-angular && npm run build:docker)
(cd contenttree-frontend-nextjs && npm run build:docker)
(cd contenttree-deploy && docker compose up)
```

The files in `contenttree-deploy/etc` contain default credentials for local development convenience
only.

## Running Tests

### Backend (Spring Boot)

Execute backend tests (including integration tests) using Gradle:

```shell
cd contenttree-backend
gw check
```

The `check` task depends on the `integrationTest` suite.

### Backend (NestJS)

Execute unit and integration tests using npm:

```shell
cd contenttree-backend-nestjs
npm test
npm run test:int
```

### Frontend (Angular)

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

### Frontend (Next.js)

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

> [!NOTE]
> This repository serves as a demonstration of my skills and a personal learning exercise. It is not
> set up to accept external contributions. The following guidelines are provided for informational
> purposes only.

The following IDEs are recommended for use:

- **Backend:**
	- [IntelliJ IDEA](https://www.jetbrains.com/idea/) (with or without the Ultimate subscription)
- **Frontend (Angular & Next.js):**
	- [Visual Studio Code](https://code.visualstudio.com/)

### Backend (Spring Boot)

#### Changing build dependencies

You can change dependencies (e.g., update dependency versions) by running the following commands:

```shell
cd contenttree-backend
gw build --write-verification-metadata pgp,sha256 --export-keys --write-locks
git diff gradle/verification-*
```

Then review the changes in the verification metadata and the lock file. Once done, update the
`origin` and `reason` fields of `trusted-key`s and checksums with your own verification info, and
delete unused versions in `verification-metadata.xml`.

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

## Design Considerations

### Usage of LLMs

In this project, I strive not to rely on LLMs heavily. I intend to write code that I understand as
much as possible, reducing the chance of introducing technical debts and security vulnerabilities
unknowingly. I have also had relatively bad experience with using LLMs for code generation so far
(e.g., outdated knowledge, context window limitations, etc.). For this reason, this project no
longer uses `AGENT.md` and related files.
