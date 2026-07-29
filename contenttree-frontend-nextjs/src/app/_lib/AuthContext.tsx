"use client";

import axios from "axios";
import { decodeJwt } from "jose";
import { useRouter } from "next/navigation";
import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";
import { AuthApi } from "@/app/_lib/api/auth-api";
import type { LoginRespDto } from "@/app/_lib/api/types";
import { TREE_API_BASE_PATH } from "@/app/tree/_lib/api/tree-api";
import { useBackendApi } from "./BackendApiContext";

export type AuthContextType = {
  loginData: LoginData | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isManager: boolean;
};

export const LOGIN_DATA_KEY = "loginData";

export type Role = "READER" | "MANAGER" | "ADMIN";

export interface LoginData {
  token: string;
  username: string;
  role: Role;
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
  const loginDataRef = useRef(loginData);
  const isAuthenticated = !!loginData;
  const isManager = isAuthenticated && ["ADMIN", "MANAGER"].includes(loginData.role);

  const initAuth = () => {
    backendApiRef.current.interceptors.request.use((config) => {
      if (!loginDataRef.current || !isProtectedPath(config.url)) {
        return config;
      }

      config.headers.setAuthorization(`Bearer ${loginDataRef.current.token}`);
      return config;
    });

    backendApiRef.current.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401 &&
          isProtectedPath(error.config?.url)
        ) {
          logout();
        }

        return Promise.reject(error);
      },
    );
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies(initAuth): only need to run once
  useEffect(() => {
    initAuth();

    return () => {};
  }, []);

  const login = async (username: string, password: string) => {
    const loginRespDto = await authApi.current.login({ username, password });
    setLoginData(convertLoginRespDtoToLoginData(loginRespDto));
    router.push("/tree");
  };

  const logout = () => {
    setLoginData(null);
    router.push("/login");
  };

  useEffect(() => {
    loginDataRef.current = loginData;

    if (loginData) {
      localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(loginData));
    } else {
      localStorage.removeItem(LOGIN_DATA_KEY);
    }
  }, [loginData]);

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

const convertLoginRespDtoToLoginData = (loginRespDto: LoginRespDto): LoginData => {
  const jwtClaims = decodeJwt(loginRespDto.token);

  return {
    token: loginRespDto.token,
    username: jwtClaims.sub!,
    role: jwtClaims["role"] as Role,
  };
};

const convertStringToLoginData = (loginDataStr: string | null): LoginData | null =>
  loginDataStr ? JSON.parse(loginDataStr) : null;
