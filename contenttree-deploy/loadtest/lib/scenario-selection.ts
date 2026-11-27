interface Scenario {
  weight: number;
  execute: (token: string) => void;
}

interface ScenarioWithCumulativeWeight extends Scenario {
  cumulativeWeight: number;
}

export const withCumulativeWeights = (scenarios: Scenario[]): ScenarioWithCumulativeWeight[] => {
  let total = 0;

  return scenarios.map((scenario) => {
    total += scenario.weight;

    return { ...scenario, cumulativeWeight: total };
  });
};

export const pickRandomScenarioWithWeights = (scenarios: ScenarioWithCumulativeWeight[]) => {
  const roll = Math.random();

  for (const element of scenarios) {
    if (roll < element.cumulativeWeight) return element;
  }

  return scenarios.at(-1)!; // float-drift guard
};
