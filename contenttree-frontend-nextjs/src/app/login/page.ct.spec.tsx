import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react/pure";
import { AuthContext } from "@/app/_lib/AuthContext";
import loginMessages from "@/i18n/messages/en/login.json";
import { it } from "@/test-utils/msw-ct";
import { t, WithTestI18nProvider } from "@/test-utils/test-i18n";
import { WithBackendApiContextProvider } from "@/test-utils/test-providers";
import LoginPage from "./page";

describe("LoginPage", () => {
  const usernameField = () => page.getByPlaceholder(t("login-page.username-field-placeholder"));
  const passwordField = page.getByPlaceholder("Enter password");
  const loginButton = page.getByRole("button", { name: "Log in", exact: true });

  const mockLoginFn = vi.fn();

  beforeEach(async () => {
    await render(
      <WithTestI18nProvider namespace="login" messages={loginMessages}>
        <WithBackendApiContextProvider>
          <AuthContext.Provider
            value={{
              loginData: null,
              isAuthenticated: false,
              login: mockLoginFn,
              logout: vi.fn(),
              isManager: false,
            }}
          >
            <LoginPage />
          </AuthContext.Provider>
        </WithBackendApiContextProvider>
      </WithTestI18nProvider>,
    );
  });

  afterEach(async () => {
    vi.clearAllMocks();
  });

  it("should submit form and navigate on successful login", async () => {
    await userEvent.fill(usernameField(), "admin");
    await userEvent.fill(passwordField, "secret");

    await expect.element(loginButton).toBeEnabled();

    await loginButton.click();

    expect(mockLoginFn).toHaveBeenCalledWith("admin", "secret");
  });

  it("should not submit form when fields are empty", async () => {
    await userEvent.fill(usernameField(), "admin");
    await userEvent.fill(passwordField, "secret");

    await expect.element(loginButton).toBeEnabled();

    await userEvent.clear(usernameField());
    await userEvent.clear(passwordField);

    await expect.element(loginButton).toBeDisabled();
  });
});
