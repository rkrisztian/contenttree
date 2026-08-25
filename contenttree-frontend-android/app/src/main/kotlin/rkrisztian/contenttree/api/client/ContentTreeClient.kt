package rkrisztian.contenttree.api.client

import io.ktor.client.call.body
import io.ktor.client.request.`get`
import io.ktor.client.request.delete
import io.ktor.client.request.post
import io.ktor.client.request.put
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.http.encodeURLPathPart
import kotlin.Int
import kotlin.Long
import kotlin.String
import kotlin.collections.List
import kotlinx.serialization.Serializable
import rkrisztian.contenttree.api.client.ClientConfiguration.Companion.defaultClientConfiguration
import rkrisztian.contenttree.api.model.ContentRespDto
import rkrisztian.contenttree.api.model.CreateTreeNodeReqDTO
import rkrisztian.contenttree.api.model.TreeNodeRespDTO
import rkrisztian.contenttree.api.model.UpdateTreeNodeReqDTO

public class ContentTreeClient(
  private val configuration: ClientConfiguration = defaultClientConfiguration,
) {
  /**
   * Retrieves all nodes without content
   */
  public suspend fun listTree(): ListTreeResponse {
    try {
      val response = configuration.client.`get`("api/tree") {
      }
      return when (response.status.value) {
        200 -> ListTreeResponseSuccess(response.body<List<TreeNodeRespDTO>>())
        else -> ListTreeResponseUnknownFailure(response.status.value)
      }
    }
    catch(e: Exception) {
      configuration.exceptionLogger(e)
      return ListTreeResponseUnknownFailure(500)
    }
  }

  /**
   * Creates a new node with the given name and content
   */
  public suspend fun createNode(request: CreateTreeNodeReqDTO): CreateNodeResponse {
    try {
      val response = configuration.client.put("api/tree") {
        setBody(request)
        contentType(ContentType.Application.Json)
      }
      return when (response.status.value) {
        200 -> CreateNodeResponseSuccess(response.body<Long>())
        else -> CreateNodeResponseUnknownFailure(response.status.value)
      }
    }
    catch(e: Exception) {
      configuration.exceptionLogger(e)
      return CreateNodeResponseUnknownFailure(500)
    }
  }

  /**
   * Updates an existing node with the given name and content
   */
  public suspend fun updateNode(request: UpdateTreeNodeReqDTO): UpdateNodeResponse {
    try {
      val response = configuration.client.post("api/tree") {
        setBody(request)
        contentType(ContentType.Application.Json)
      }
      return when (response.status.value) {
        200 -> UpdateNodeResponseSuccess
        else -> UpdateNodeResponseUnknownFailure(response.status.value)
      }
    }
    catch(e: Exception) {
      configuration.exceptionLogger(e)
      return UpdateNodeResponseUnknownFailure(500)
    }
  }

  /**
   * Moves the given node under the given parent node
   */
  public suspend fun moveNode(nodeId: Long, newParentId: Long): MoveNodeResponse {
    try {
      val response = configuration.client.post("api/tree/move") {
        url {
          parameters.append("nodeId", nodeId.toString())
          parameters.append("newParentId", newParentId.toString())
        }
      }
      return when (response.status.value) {
        200 -> MoveNodeResponseSuccess
        else -> MoveNodeResponseUnknownFailure(response.status.value)
      }
    }
    catch(e: Exception) {
      configuration.exceptionLogger(e)
      return MoveNodeResponseUnknownFailure(500)
    }
  }

  /**
   * Retrieves all nodes having a substring in name or content, ignoring case
   */
  public suspend fun findNode(text: String): FindNodeResponse {
    try {
      val response = configuration.client.`get`("api/tree/search") {
        url {
          parameters.append("text", text)
        }
      }
      return when (response.status.value) {
        200 -> FindNodeResponseSuccess(response.body<List<Long>>())
        else -> FindNodeResponseUnknownFailure(response.status.value)
      }
    }
    catch(e: Exception) {
      configuration.exceptionLogger(e)
      return FindNodeResponseUnknownFailure(500)
    }
  }

  /**
   * Retrieves the content of a node
   */
  public suspend fun getContent(id: Long): GetContentResponse {
    try {
      val response = configuration.client.`get`("api/tree/content/{id}".replace("/{id}", "/${id.toString().encodeURLPathPart()}")) {
      }
      return when (response.status.value) {
        200 -> GetContentResponseSuccess(response.body<ContentRespDto>())
        else -> GetContentResponseUnknownFailure(response.status.value)
      }
    }
    catch(e: Exception) {
      configuration.exceptionLogger(e)
      return GetContentResponseUnknownFailure(500)
    }
  }

  /**
   * Deletes a node with all children recursively
   */
  public suspend fun deleteNode(id: Long): DeleteNodeResponse {
    try {
      val response = configuration.client.delete("api/tree/{id}".replace("/{id}", "/${id.toString().encodeURLPathPart()}")) {
      }
      return when (response.status.value) {
        200 -> DeleteNodeResponseSuccess
        else -> DeleteNodeResponseUnknownFailure(response.status.value)
      }
    }
    catch(e: Exception) {
      configuration.exceptionLogger(e)
      return DeleteNodeResponseUnknownFailure(500)
    }
  }

  @Serializable
  public sealed class ListTreeResponse

  @Serializable
  public data class ListTreeResponseSuccess(
    public val body: List<TreeNodeRespDTO>,
  ) : ListTreeResponse()

  @Serializable
  public data class ListTreeResponseUnknownFailure(
    public val statusCode: Int,
  ) : ListTreeResponse()

  @Serializable
  public sealed class CreateNodeResponse

  @Serializable
  public data class CreateNodeResponseSuccess(
    public val body: Long,
  ) : CreateNodeResponse()

  @Serializable
  public data class CreateNodeResponseUnknownFailure(
    public val statusCode: Int,
  ) : CreateNodeResponse()

  @Serializable
  public sealed class UpdateNodeResponse

  @Serializable
  public object UpdateNodeResponseSuccess : UpdateNodeResponse()

  @Serializable
  public data class UpdateNodeResponseUnknownFailure(
    public val statusCode: Int,
  ) : UpdateNodeResponse()

  @Serializable
  public sealed class MoveNodeResponse

  @Serializable
  public object MoveNodeResponseSuccess : MoveNodeResponse()

  @Serializable
  public data class MoveNodeResponseUnknownFailure(
    public val statusCode: Int,
  ) : MoveNodeResponse()

  @Serializable
  public sealed class FindNodeResponse

  @Serializable
  public data class FindNodeResponseSuccess(
    public val body: List<Long>,
  ) : FindNodeResponse()

  @Serializable
  public data class FindNodeResponseUnknownFailure(
    public val statusCode: Int,
  ) : FindNodeResponse()

  @Serializable
  public sealed class GetContentResponse

  @Serializable
  public data class GetContentResponseSuccess(
    public val body: ContentRespDto,
  ) : GetContentResponse()

  @Serializable
  public data class GetContentResponseUnknownFailure(
    public val statusCode: Int,
  ) : GetContentResponse()

  @Serializable
  public sealed class DeleteNodeResponse

  @Serializable
  public object DeleteNodeResponseSuccess : DeleteNodeResponse()

  @Serializable
  public data class DeleteNodeResponseUnknownFailure(
    public val statusCode: Int,
  ) : DeleteNodeResponse()
}
