package contenttree.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.postgresql.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

@TestConfiguration(proxyBeanMethods = false)
public class TestcontainersConfiguration {

	@Value("${POSTGRES_IMAGE}")
	private String dbImageName;

	@Bean
	@ServiceConnection
	PostgreSQLContainer postgresDbContainer() {
		//noinspection resource: false positive
		return new PostgreSQLContainer(
				DockerImageName.parse(dbImageName)
						.asCompatibleSubstituteFor("postgres"))
				.withCommand("-c", "fsync=off")
				.withReuse(true)
				.withCreateContainerCmdModifier(cmd -> cmd.withName("contenttree-backend-test-db"));
	}

}
