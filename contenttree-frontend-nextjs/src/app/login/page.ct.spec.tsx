import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react/pure";
import { it } from "@/test-utils/msw-ct";
import { WithBackendApiContextProvider } from "@/test-utils/test-providers";
import { AuthContext } from "../_lib/AuthContext";
import LoginPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("LoginPage", () => {
  const usernameField = page.getByPlaceholder("Enter username");
  const passwordField = page.getByPlaceholder("Enter password");
  const loginButton = page.getByRole("button", { name: "Log in", exact: true });

  const mockLoginFn = vi.fn();

  beforeEach(async () => {
    await render(
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
      </WithBackendApiContextProvider>,
    );
  });

  afterEach(async () => {
    vi.clearAllMocks();
  });

  it("should submit form and navigate on successful login", async () => {
    await userEvent.fill(usernameField, "admin");
    await userEvent.fill(passwordField, "secret");

    await expect.element(loginButton).toBeEnabled();

    await loginButton.click();

    expect(mockLoginFn).toHaveBeenCalledWith("admin", "secret");
  });

  it("should not submit form when fields are empty", async () => {
    await userEvent.fill(usernameField, "admin");
    await userEvent.fill(passwordField, "secret");

    await expect.element(loginButton).toBeEnabled();

    await userEvent.clear(usernameField);
    await userEvent.clear(passwordField);

    await expect.element(loginButton).toBeDisabled();
  });
});
