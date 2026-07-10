import type { AxiosInstance } from "axios";
import type { RefObject } from "react";
import type { components } from "../../_lib/schema";

export type TreeNodeRespDTO = components["schemas"]["TreeNodeRespDTO"];
export type ContentRespDto = components["schemas"]["ContentRespDto"];
export type CreateTreeNodeReqDTO = components["schemas"]["CreateTreeNodeReqDTO"];
export type UpdateTreeNodeReqDTO = components["schemas"]["UpdateTreeNodeReqDTO"];

export const TREE_API_BASE_PATH = "/api/tree";

export class TreeApi {
  constructor(private readonly backendApiRef: RefObject<AxiosInstance>) {}

  readonly getFlatNodes = async () =>
    (await this.getBackendApi().get<TreeNodeRespDTO[]>(TREE_API_BASE_PATH)).data;

  readonly getContentForSelectedNode = async (selectedNodeId: number) =>
    (
      await this.getBackendApi().get<ContentRespDto>(
        `${TREE_API_BASE_PATH}/content/${encodeURIComponent(selectedNodeId)}`,
      )
    ).data;

  readonly getFoundNodes = async (searchText: string) =>
    searchText
      ? (
          await this.getBackendApi().get<number[]>(`${TREE_API_BASE_PATH}/search`, {
            params: { text: searchText },
          })
        ).data
      : [];

  readonly createNode = async (node: CreateTreeNodeReqDTO) =>
    Number((await this.getBackendApi().put(TREE_API_BASE_PATH, node)).data);

  readonly updateNode = async (node: UpdateTreeNodeReqDTO) =>
    this.getBackendApi().post(TREE_API_BASE_PATH, node);

  readonly deleteNode = async (id: number) =>
    this.getBackendApi().delete(`${TREE_API_BASE_PATH}/${encodeURIComponent(id)}`);

  readonly moveNode = async (nodeId: number, newParentId: number) =>
    this.getBackendApi().post(`${TREE_API_BASE_PATH}/move`, null, {
      params: { nodeId, newParentId },
    });

  private readonly getBackendApi = () => this.backendApiRef.current;
}
