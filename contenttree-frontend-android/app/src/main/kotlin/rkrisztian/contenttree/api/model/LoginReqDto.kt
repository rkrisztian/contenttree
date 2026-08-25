package rkrisztian.contenttree.api.model

import kotlin.String
import kotlinx.serialization.Serializable

@Serializable
public data class LoginReqDto(
  public val password: String,
  public val username: String,
)
