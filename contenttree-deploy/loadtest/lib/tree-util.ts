import exec from 'k6/execution';
import { TreeNodeRespDTO } from '../../api/schema';

export const unique = (name: string) => `${name} ${exec.scenario.iterationInTest}`;

export const getRootNode = (flatNodes: TreeNodeRespDTO[]) =>
  flatNodes.find((node) => !node.parentId)!;
