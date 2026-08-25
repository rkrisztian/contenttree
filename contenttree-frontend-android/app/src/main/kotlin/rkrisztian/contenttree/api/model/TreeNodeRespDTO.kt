package rkrisztian.contenttree.api.model

import kotlin.Long
import kotlin.String
import kotlinx.serialization.Serializable

@Serializable
public data class TreeNodeRespDTO(
  public val id: Long,
  public val name: String,
  public val parentId: Long? = null,
)
