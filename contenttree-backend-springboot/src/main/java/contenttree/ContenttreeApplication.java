package contenttree;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public final class ContenttreeApplication {

	private ContenttreeApplication() {
		// This is the main class.
	}

	// PMD does not support the new Java 25 feature yet: https://github.com/pmd/pmd/issues/6117
	@SuppressWarnings({"PMD.CommentDefaultAccessModifier"})
	static void main(String[] args) {
		SpringApplication.run(ContenttreeApplication.class, args);
	}

}
