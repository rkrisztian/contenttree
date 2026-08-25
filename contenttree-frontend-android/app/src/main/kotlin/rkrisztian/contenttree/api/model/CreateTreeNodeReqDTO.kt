package rkrisztian.contenttree.api.model

import kotlin.Long
import kotlin.String
import kotlinx.serialization.Serializable

@Serializable
public data class CreateTreeNodeReqDTO(
  public val content: String,
  public val name: String,
  public val parentId: Long? = null,
)
