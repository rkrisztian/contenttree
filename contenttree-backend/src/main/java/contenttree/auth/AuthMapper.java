package contenttree.auth;

import contenttree.auth.dto.LoginRespDto;
import contenttree.auth.services.JwtService.JwtClaims;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
@SuppressWarnings("PMD.ImplicitFunctionalInterface")
public interface AuthMapper {

	LoginRespDto toLoginRespDTO(String token, JwtClaims jwtClaims);

}
