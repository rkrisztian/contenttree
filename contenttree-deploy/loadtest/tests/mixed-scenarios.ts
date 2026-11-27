import { test } from 'k6/execution';
import { LoginRespDto } from '../../api/schema';
import { cleanUpDb } from '../lib/actions/clean-up-db.ts';
import { logIn } from '../lib/actions/log-in.ts';
import { setUpDb } from '../lib/actions/set-up-db.ts';
import { TreeApi } from '../lib/api/tree-api.ts';
import { pickRandomScenarioWithWeights, withCumulativeWeights } from '../lib/scenario-selection.ts';
import { deleteNode } from '../lib/scenarios/delete-node.ts';
import { editNode } from '../lib/scenarios/edit-node.ts';
import { moveNode } from '../lib/scenarios/move-node.ts';
import { searchNode } from '../lib/scenarios/search-node.ts';

export const options = {
  scenarios: {
    'mixed-scenarios': {
      executor: 'ramping-arrival-rate',
      startRate: 60,
      timeUnit: '6s',
      preAllocatedVUs: 600,
      stages: [
        { target: 600, duration: '10s' },
        { target: 600, duration: '40s' },
        { target: 60, duration: '10s' },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<300'],
    dropped_iterations: ['count<10'],
  },
};

export function setup() {
  const loginRes = logIn();

  if (!loginRes) {
    test.abort('Failed to log in');
  }

  const treeApi = new TreeApi(loginRes!.token);

  if (!cleanUpDb(treeApi)) {
    test.abort('Failed to clean up DB');
  }
  if (!setUpDb(treeApi)) {
    test.abort('Failed to set up DB');
  }

  return loginRes!;
}

const scenarios = withCumulativeWeights([
  {
    weight: 0.17,
    execute: (token: string) => deleteNode(token),
  },
  {
    weight: 0.25,
    execute: (token: string) => editNode(token),
  },
  {
    weight: 0.4,
    execute: (token: string) => searchNode(token),
  },
  {
    weight: 0.18,
    execute: (token: string) => moveNode(token),
  },
]);

export default function mixedScenarios(loginRes: LoginRespDto) {
  if (!loginRes) return;
  return pickRandomScenarioWithWeights(scenarios).execute(loginRes.token);
}

export { handleSummary } from '../lib/summary.ts';
