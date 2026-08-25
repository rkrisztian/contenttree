package rkrisztian.contenttree.api.model

import kotlin.String
import kotlinx.serialization.Serializable

@Serializable
public data class LoginRespDto(
  public val token: String,
)
