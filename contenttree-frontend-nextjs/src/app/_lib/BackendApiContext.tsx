"use client";

import axios, { type AxiosError, type AxiosInstance } from "axios";
import {
  createContext,
  type ReactNode,
  type RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SWRConfig } from "swr";
import { REMOTE_CONFIG_PATH, type RemoteConfig } from "@/app/api/config/route";

export type BackendApiContextType = {
  backendApiRef: RefObject<AxiosInstance>;
  loading: boolean;
  errors: ErrorData[];
  latestError: ErrorData | null;
  addAndShowError: (newErrorData: Omit<ErrorData, "id">) => void;
  removeError: (errorId: string) => void;
  hideLatestError: () => void;
  copyToClipboard: (errorData: ErrorData) => Promise<void>;
  remoteConfigLoading: boolean;
};

export interface ErrorData {
  id: string;
  error: string;
  message: string;
  traceId?: string;
}

export const BackendApiContext = createContext<BackendApiContextType | undefined>(undefined);

export const BackendApiContextProvider = ({ children }: { children: ReactNode }) => {
  const backendApiRef = useRef<AxiosInstance>(axios.create({ timeout: 10000 }));
  const [loadingCounter, setLoadingCounter] = useState(0);
  const loading = !!loadingCounter;
  const [errors, setErrors] = useState<ErrorData[]>([]);
  const [latestError, setLatestError] = useState<ErrorData | null>(null);
  const [remoteConfigLoading, setRemoteConfigLoading] = useState(true);

  const initBackendApi = async () => {
    backendApiRef.current.interceptors.request.use((config) => {
      setLoadingCounter((counter) => counter + 1);
      return config;
    });

    backendApiRef.current.interceptors.response.use(
      (response) => {
        setLoadingCounter((counter) => counter - 1);
        return response;
      },
      (error) => {
        setLoadingCounter((counter) => counter - 1);

        if (error.response?.data.error && error.response?.data.message) {
          addAndShowError({
            error: error.response.data.error,
            message: error.response.data.message,
            traceId: error.response.data.traceId || error.response.data.trace,
          });
        } else if (error.request) {
          addAndShowError({
            error: "Unexpected error",
            message: `${(error as AxiosError).config?.url ?? "unknown URL"}: ${error.message}`,
          });
        } else if (!error.isAxiosError || error.code !== "ERR_CANCELED") {
          console.error("Unknown error: ", error);
        }

        return Promise.reject(error);
      },
    );

    setLoadingCounter((counter) => counter + 1);
    const apiBaseUrl = (await axios.get<RemoteConfig>(REMOTE_CONFIG_PATH)).data.apiBaseUrl;
    backendApiRef.current.defaults.baseURL = apiBaseUrl;
    setLoadingCounter((counter) => counter - 1);
    setRemoteConfigLoading(false);
  };

  const addAndShowError = (newErrorData: Omit<ErrorData, "id">) => {
    const errorData = {
      ...newErrorData,
      id: crypto.randomUUID(),
    };

    setErrors((errors) => [errorData, ...errors]);
    setLatestError(errorData);
  };

  const hideLatestError = (): void => {
    setLatestError(null);
  };

  const removeError = (errorId: string): void => {
    setErrors(errors.filter((error) => error.id !== errorId));

    if (latestError?.id === errorId) {
      hideLatestError();
    }
  };

  const copyToClipboard = async (errorData: ErrorData): Promise<void> => {
    const details = [
      `Error: ${errorData.error}`,
      `Message: ${errorData.message}`,
      ...(errorData.traceId ? [`Trace ID: ${errorData.traceId}`] : []),
    ].join("\n");

    await navigator.clipboard.writeText(details);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies(initBackendApi): only need to run once
  useEffect(() => {
    initBackendApi();

    return () => {};
  }, []);

  return (
    <BackendApiContext.Provider
      value={{
        backendApiRef,
        loading,
        errors,
        latestError,
        addAndShowError,
        removeError,
        hideLatestError,
        copyToClipboard,
        remoteConfigLoading,
      }}
    >
      <SWRConfig
        value={{
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
          shouldRetryOnError: false,
        }}
      >
        {children}
      </SWRConfig>
    </BackendApiContext.Provider>
  );
};

export const useBackendApi = () => {
  const context = useContext(BackendApiContext);
  if (!context) throw new Error("useBackendApi must be used within a BackendApiContextProvider");
  return context;
};
