## Code Formatting

- Use IntelliJ IDEA default code style for Java.
- Line Length: Maximum 100 characters.
- Use UTF-8 encoding.

## Java Style

- Use the `var` keyword instead of explicit types when the type is easy to deduct.
- Method parameters should not be marked as `final`, but they should be treated as if they were
  `final`.
- All variables should be declared as `final` where possible.
- Prefer immutable objects and pure functions where possible.
- Instead of proliferating methods with null checks, use JSpecify's `@NonNull` annotation to mark
  parameters as not nullable.
- Prefer unchecked exceptions over `throws` clauses, unless it is important that the caller
  explicitly handles the exception.
- Avoid comments. Only use comments when the code alone cannot explain itself, e.g., for cron
  expressions, regex patterns, TODOs or given/when/then separation in tests.
- Use `@Override` annotation when overriding methods.
- For simple methods, prefer method bodies with just one (return) statement.
- For more complex functions, prefer early returns (guard clauses) to separate non-happy paths.
- Don't use Lombok, use record classes instead where possible.

## Annotations

- Use REST-specific annotations where possible, like `@RestController` and `@RestControllerAdvice`
  to benefit from `@ResponseBody`.
- Regarding `@Autowired`, prefer constructor injection in production code and field injection only
  for tests.
- Prefer `@ConfigurationProperties` over `@Value` for binding 3 more related properties.
- Only Service classes should be annotated with `@Transactional` at class level to avoid transaction
  management in each method.- Use `@Validated` to enable Bean Validation in method parameters or
  classes.
- Circular dependencies should be avoided. Avoid `@Order` annotation for dependency resolution.

## Mappers

- Use MapStruct for mapping between DTOs and entities.
- Use `@Mapping` annotation for custom field mappings.
- Use `componentModel = "spring"` to allow Spring to manage mapper instances.
- Mapper should have as suffix `Mapper` (e.g., `UserMapper`).
- Name mapper methods clearly (e.g., `toDto`, `toEntity`).

## Testing

- Use JUnit 5 for unit and integration testing.
- Use Mockito for mocking dependencies in unit tests.
- Use `@WebMvcTest(ControllerClass.class)` for testing Spring MVC controllers.
- Use `@SpringBootTest` for integration tests that require the Spring context.
- Use `given/when/then` structure in test methods for clarity.
- Avoid reflection in tests.
- Avoid business logic in tests; focus on behavior verification.

## Logging

- Log at appropriate levels: `DEBUG`, `INFO`, `WARN`, `ERROR`.
- Avoid logging sensitive information.
- Use structured logging for better log management.
- Format log messages with placeholders (e.g., `{}`) instead of string concatenation.
