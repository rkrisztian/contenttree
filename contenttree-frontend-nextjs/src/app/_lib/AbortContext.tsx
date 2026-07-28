"use client";

import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";
import useSWR, { type Key, unstable_serialize } from "swr";

export type AbortContextType = {
  withAbort: <Data>(
    category: string,
    fetcher: (signal: AbortSignal) => Promise<Data>,
  ) => Promise<Data>;
};

export const AbortContext = createContext<AbortContextType | undefined>(undefined);

export const AbortContextProvider = ({ children }: { children: ReactNode }) => {
  const controllers = useRef(new Map<string, AbortController>());

  const withAbort = async <Data,>(
    category: string,
    fetcher: (signal: AbortSignal) => Promise<Data>,
  ) => {
    let data: Data;

    try {
      data = await fetcher(addOrReplaceAbortSignal(category));
    } finally {
      removeAbortSignal(category);
    }

    return data;
  };

  const addOrReplaceAbortSignal = (category: string) => {
    const prevController = controllers.current.get(category);

    if (prevController) {
      prevController.abort();
    }

    const controller = new AbortController();
    controllers.current.set(category, controller);

    return controller.signal;
  };

  const removeAbortSignal = (category: string) => {
    controllers.current.delete(category);
  };

  // React Strict Mode workaround
  const [finalRender, setFinalRender] = useState(false);

  useEffect(() => {
    setFinalRender(true);

    return () => {
      if (finalRender) {
        controllers.current.values().forEach((controller) => {
          controller.abort();
        });
      }
    };
  }, [finalRender]);

  return <AbortContext.Provider value={{ withAbort }}>{children}</AbortContext.Provider>;
};

export const useAbortContext = () => {
  const context = useContext(AbortContext);
  if (!context) throw new Error("useAbortContext must be used within a AbortContextProvider");
  return context;
};

export const useSwrWithAbort = <Data,>(
  key: Key,
  fetcher: (signal: AbortSignal) => Promise<Data>,
) => {
  const { withAbort } = useAbortContext();

  return useSWR(key, async () => withAbort(convertToCategory(key), fetcher));
};

const convertToCategory = (key: Key) => unstable_serialize(Array.isArray(key) ? key[0] : key);
