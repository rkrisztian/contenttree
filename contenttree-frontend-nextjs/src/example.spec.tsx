import { act, renderHook } from "@testing-library/react";
import { createContext, type ReactNode, Suspense, useContext } from "react";
import useSWR, { SWRConfig, type SWRResponse } from "swr";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ErrorBoundary } from "./app/_lib/ErrorBoundary";

// biome-ignore lint/suspicious/noExplicitAny: todo
let testCache: Map<any, any> | null = null;

beforeEach(() => {
  testCache = new Map();
});

afterEach(() => {
  testCache = null;
});

type UserData = { id: number; name: string };

let triggerFetch: () => void;

const mockFetcher = async (_key: string): Promise<UserData> => {
  return new Promise((resolve) => {
    triggerFetch = () => resolve({ id: 1, name: "Test User" });
  });
};

const DataContext = createContext<SWRResponse<UserData> | null>(null);

function useData(): SWRResponse<UserData> {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

function DataProvider({ children }: { children: ReactNode }) {
  const data = useSWR("provider-key", mockFetcher, { suspense: true });
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

function TestConsumer({ children }: { children?: ReactNode }) {
  const data = useData();

  return (
    <>
      {children}
      <ErrorBoundary fallback={<p>An error occurred</p>}>
        <Suspense fallback={<div>Loading...</div>}>
          {/* Trigger suspense resolution */}
          {data.data.name}
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

describe("SWR Suspense via Context Provider", () => {
  it("resolves provider suspense and makes data available to consumer", async () => {
    const { result } = await act(() =>
      renderHook(() => ({ data: useData() }), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <SWRConfig value={{ provider: () => testCache!, dedupingInterval: 0 }}>
            <DataProvider>
              <TestConsumer>{children}</TestConsumer>
            </DataProvider>
          </SWRConfig>
        ),
      }),
    );

    //screen.debug();
    //console.log(result.current?.data);
    await act(async () => triggerFetch());
    expect(result.current.data.data).toEqual({ id: 1, name: "Test User" });
    //screen.debug();
    //console.log(result.current?.data);
  });
});
