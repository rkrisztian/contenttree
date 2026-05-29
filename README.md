# Content Tree Management App

A hands-on project demonstrating full-stack development skills, originally built as a home
assignment and later expanded.

This app manages content trees. You can add, delete, edit tree nodes and their contents, move nodes
to another parent, as well as search nodes by name or content.

## Used technology stack

The app consists of a Spring Boot backend and an Angular frontend.

- **Backend:**
    - [Spring Boot](https://spring.io/projects/spring-boot) (REST API)
    - [Gradle](https://gradle.org/) (build tool)
    - [PostgreSQL](https://www.postgresql.org/) (database)
    - [MapStruct](https://mapstruct.org/) (DTO mapping)
    - [Testcontainers](https://testcontainers.com/) (integration testing)
    - [NullAway](https://github.com/uber/NullAway) (null safety checker)
    - [PMD](https://pmd.github.io/) (code linting)
- **Frontend:**
	- [Angular](https://angular.dev/) (component-based UI)
	- [OpenAPI TypeScript](https://openapi-ts.dev/) (type-safe API interactions)
	- [Angular Material](https://material.angular.dev/) (UI components)
    - [ESLint](https://eslint.org/) (code linting)

## Running the Application

### Prerequisites

- **Backend:**
	- [Java Development Kit](https://www.java.com/en/) 25 or later
	- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
	- *(Optional)* [GNG](https://github.com/gdubw/gng) (provides the `gw` command)
- **Frontend:**
	- [Node.js](https://nodejs.org/en) and [npm](https://nodejs.org/learn/node-api/getting-started/tools#npm)

You can install Java and Node.js using
[a version manager of your choice](https://github.com/bernardoduarte/awesome-version-managers).

### Backend

Navigate to the `backend` folder and start the Spring Boot application. This command also triggers
Docker Compose to start the PostgreSQL database and DbGate service defined in `compose.yaml`.

```bash
cd contenttree-backend
gw bootRun
```

The `bootRun` task defaults to the `dev` profile if no other profile is explicitly set via
environment variable (`SPRING_PROFILES_ACTIVE`) or command-line arguments
(`--spring.profiles.active=prod`). You can override this default in your IDE's Run Configuration.

Once the backend is running, the API documentation is available at
[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html). The Actuator can be
accessed at `http://localhost:8081/actuator/<endpoint>`, e.g.,
[http://localhost:8081/actuator/health](http://localhost:8081/actuator/health).


The backend depends on PostgreSQL and in a development environment uses
the `spring-boot-docker-compose` plugin to manage the database lifecycle.

If you do not have IntelliJ IDEA Ultimate edition and you need a database manager tool, you can view
and manage the `contenttree` database content via the DbGate UI
at [http://localhost:5433/](http://localhost:5433/) after running the `bootRun` task the following
way:

```shell
cd contenttree-backend
gw bootRun --args='--spring.docker.compose.profiles.active=debug'
```

### Frontend

Navigate to the `frontend` folder and start the Angular development server.

```shell
cd contenttree-frontend
npm ci
npm start
```

This runs the `ng serve` command. Once the frontend is running, the application will be available at
[http://localhost:4200/tree](http://localhost:4200/tree).

## Running Tests

### Backend Tests

Execute backend tests (including integration tests) using Gradle:

```shell
cd contenttree-backend
gw check
```

The `check` task depends on the `integrationTest` suite.

### Frontend Tests

Execute frontend tests using npm:

```shell
cd contenttree-frontend
npm test
```

This runs the `ng test` command.

## Contribution

The following IDEs are recommended for use:

- **Backend:**
	- [IntelliJ IDEA](https://www.jetbrains.com/idea/) (with or without the Ultimate subscription)
- **Frontend:**
	- [Visual Studio Code](https://code.visualstudio.com/)

### Backend

#### Changing build dependencies

You can change dependencies (e.g., update dependency versions) by running the following commands:

```shell
cd contenttree-backend
gw --write-verification-metadata pgp,sha256 --export-keys
gw dependencies --write-locks
```

Then review the changes in the verification metadata and the lock file.
