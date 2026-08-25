package rkrisztian.contenttree.api.client

import io.ktor.client.call.body
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType
import kotlin.Int
import kotlinx.serialization.Serializable
import rkrisztian.contenttree.api.client.ClientConfiguration.Companion.defaultClientConfiguration
import rkrisztian.contenttree.api.model.LoginReqDto
import rkrisztian.contenttree.api.model.LoginRespDto

public class AuthClient(
  private val configuration: ClientConfiguration = defaultClientConfiguration,
) {
  /**
   * Logs in and generates a JWT token
   */
  public suspend fun login(request: LoginReqDto): LoginResponse {
    try {
      val response = configuration.client.post("api/auth/login") {
        setBody(request)
        contentType(ContentType.Application.Json)
      }
      return when (response.status.value) {
        200 -> LoginResponseSuccess(response.body<LoginRespDto>())
        else -> LoginResponseUnknownFailure(response.status.value)
      }
    }
    catch(e: Exception) {
      configuration.exceptionLogger(e)
      return LoginResponseUnknownFailure(500)
    }
  }

  @Serializable
  public sealed class LoginResponse

  @Serializable
  public data class LoginResponseSuccess(
    public val body: LoginRespDto,
  ) : LoginResponse()

  @Serializable
  public data class LoginResponseUnknownFailure(
    public val statusCode: Int,
  ) : LoginResponse()
}
