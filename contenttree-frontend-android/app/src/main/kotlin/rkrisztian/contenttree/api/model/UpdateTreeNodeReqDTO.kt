package rkrisztian.contenttree.api.model

import kotlin.Long
import kotlin.String
import kotlinx.serialization.Serializable

@Serializable
public data class UpdateTreeNodeReqDTO(
  public val content: String,
  public val id: Long,
  public val name: String,
)
