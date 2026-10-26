package contenttree.auth;

import contenttree.auth.dto.LoginRespDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
@SuppressWarnings("PMD.ImplicitFunctionalInterface")
public interface AuthMapper {

	LoginRespDto toLoginRespDTO(String token);

}
