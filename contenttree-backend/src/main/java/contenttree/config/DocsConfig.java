package contenttree.config;

import contenttree.repository.TreeNodeRepository;
import contenttree.repository.TreeNodeWithContentRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.lang.reflect.Proxy;

/**
 * Allows the OpenAPI Docs generation without initializing the database layer.
 */
@Configuration
@Profile("docs")
public class DocsConfig {

	@Bean
	public TreeNodeRepository treeNodeRepository() {
		return createStub(TreeNodeRepository.class);
	}

	@Bean
	public TreeNodeWithContentRepository treeNodeWithContentRepository() {
		return createStub(TreeNodeWithContentRepository.class);
	}

	// PMD.UseProperClassLoader: JPA interfaces always have non-null classloader in Spring Boot.
	// ReferenceEquality: This proxy must not use value equality to prevent infinite recursion.
	@SuppressWarnings({"unchecked", "PMD.UseProperClassLoader", "PMD.CompareObjectsWithEquals",
			"ReferenceEquality"})
	private static <T> T createStub(Class<T> interfaceClass) {
		return (T) Proxy.newProxyInstance(
				interfaceClass.getClassLoader(),
				new Class<?>[]{interfaceClass},
				(proxy, method, args) ->
						switch (method.getName()) {
							case "equals" -> proxy == args[0];
							case "hashCode" -> System.identityHashCode(proxy);
							case "toString" -> proxy.getClass().getName() + "@stub";
							default -> throw new UnsupportedOperationException(
									"This stub implementation does not support real functionality.");
						}
		);
	}

}
