package contenttree.auth.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

import static jakarta.persistence.GenerationType.SEQUENCE;

@Entity
@Table(name = "users")
public class User {
	@Id
	@GeneratedValue(strategy = SEQUENCE)
	@SequenceGenerator(allocationSize = 1)
	private Long id;

	@Column(unique = true, nullable = false, length = 50)
	private String name;

	@Column(nullable = false)
	private String passwordHash;

	@Column(nullable = false, length = 20)
	@Enumerated(EnumType.STRING)
	private Role role;

	public User() {
	}

	public User(String name, String passwordHash, Role role) {
		this.name = name;
		this.passwordHash = passwordHash;
		this.role = role;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	@Override
	public final boolean equals(Object o) {
		if (!(o instanceof User that)) return false;
		return id.equals(that.id);
	}

	@Override
	public int hashCode() {
		return id.hashCode();
	}

}
