"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TREE_API_BASE_PATH } from "../tree/_lib/tree-api";
import { AuthApi, type LoginRespDto } from "./auth-api";
import { useBackendApi } from "./BackendApiContext";

export type AuthContextType = {
  loginData: LoginData | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isManager: boolean;
};

export const LOGIN_DATA_KEY = "loginData";

export interface LoginData {
  token: string;
  username: string;
  role: LoginRespDto["role"];
  expiration: Date;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { backendApiRef } = useBackendApi();
  const authApi = useRef(new AuthApi(backendApiRef));

  const router = useRouter();

  const [loginData, setLoginData] = useState<LoginData | null>(() =>
    typeof window !== "undefined"
      ? convertStringToLoginData(localStorage.getItem(LOGIN_DATA_KEY))
      : null,
  );
  const isAuthenticated = !!loginData;
  const isManager = useMemo(
    () => !!loginData && ["ADMIN", "MANAGER"].includes(loginData.role),
    [loginData],
  );
  // Needed to track loginData updates inside the context
  // TODO: Find a cleaner solution.
  const loginDataRef = useRef<AuthContextType["loginData"]>(loginData);

  const initAuth = async () => {
    backendApiRef.current.interceptors.request.use((config) => {
      if (!loginDataRef.current || !isProtectedPath(config.url)) {
        return config;
      }
      if (autoLogOutIfLoginExpired()) {
        const controller = new AbortController();
        config.signal = controller.signal;
        controller.abort();
        return config;
      }

      config.headers.setAuthorization(`Bearer ${loginDataRef.current.token}`);
      return config;
    });
  };

  const login = async (username: string, password: string) => {
    const loginRespDto = await authApi.current.login({ username, password });
    storeLoginData(loginRespDto);
    router.push("/tree");
  };

  const logout = () => {
    clearLoginData();
    router.push("/login");
  };

  const autoLogOutIfLoginExpired = () => {
    if (loginData && loginData.expiration <= new Date()) {
      clearLoginData();
      router.push("/login");
      return true;
    }

    return false;
  };

  const storeLoginData = (loginRespDto: LoginRespDto): void => {
    const loginData = convertLoginRespDtoToLoginData(loginRespDto);
    localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(loginData));
    loginDataRef.current = loginData;
    setLoginData(loginData);
  };

  const clearLoginData = (): void => {
    localStorage.removeItem(LOGIN_DATA_KEY);
    loginDataRef.current = null;
    setLoginData(null);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies(initAuth): only need to run once
  useEffect(() => {
    initAuth();

    return () => {};
  }, []);

  return (
    <AuthContext.Provider value={{ loginData, isAuthenticated, login, logout, isManager }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within a AuthContextProvider");
  return context;
};

const isProtectedPath = (pathname: string | undefined) => {
  if (!pathname) return false;
  return pathname.startsWith(TREE_API_BASE_PATH);
};

const convertLoginRespDtoToLoginData = (loginRespDto: LoginRespDto): LoginData => ({
  token: loginRespDto.token,
  username: loginRespDto.username,
  role: loginRespDto.role,
  expiration: new Date(loginRespDto.expiration),
});

const convertStringToLoginData = (loginDataStr: string | null): LoginData | null => {
  if (!loginDataStr) {
    return null;
  }

  const loginData = JSON.parse(loginDataStr);

  return { ...loginData, expiration: new Date(loginData.expiration) };
};
