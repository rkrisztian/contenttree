package contenttree.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("dev")
public class OpenApiConfig {

	private static final String BEARER_AUTH_SCHEME = "BearerAuth";

	@Bean
	public OpenAPI customOpenAPI() {
		return new OpenAPI()
				.info(new Info().title("Content Tree Management App API"))
				.addSecurityItem(new SecurityRequirement().addList(BEARER_AUTH_SCHEME))
				.components(new io.swagger.v3.oas.models.Components()
						.addSecuritySchemes(BEARER_AUTH_SCHEME,
								new SecurityScheme()
										.name(BEARER_AUTH_SCHEME)
										.type(SecurityScheme.Type.HTTP)
										.scheme("bearer")
										.bearerFormat("JWT")));
	}

}
