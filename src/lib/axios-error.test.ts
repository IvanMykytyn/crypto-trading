import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { describe, expect, it } from "vitest";

import { getRequestErrorMessage } from "./axios-error";

function axiosResponseError(
  status: number,
  data: unknown,
  message = "Request failed",
): AxiosError {
  return new AxiosError(
    message,
    "ERR_BAD_REQUEST",
    {} as InternalAxiosRequestConfig,
    {},
    {
      status,
      data,
      statusText: "Error",
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    },
  );
}

describe("getRequestErrorMessage", () => {
  it("formats axios error with status and string body", () => {
    const err = axiosResponseError(500, "Internal problem");
    expect(getRequestErrorMessage(err)).toBe(
      "Request failed (500): Internal problem",
    );
  });

  it("reads top-level message JSON", () => {
    const err = axiosResponseError(400, { message: "Invalid id" });
    expect(getRequestErrorMessage(err)).toBe(
      "Request failed (400): Invalid id",
    );
  });

  it("reads CoinGecko-style status.error_message", () => {
    const err = axiosResponseError(429, {
      status: { error_message: "Rate limit exceeded" },
    });
    expect(getRequestErrorMessage(err)).toBe(
      "Request failed (429): Rate limit exceeded",
    );
  });

  it("joins errors array of strings", () => {
    const err = axiosResponseError(422, { errors: ["a", "b"] });
    expect(getRequestErrorMessage(err)).toBe("Request failed (422): a, b");
  });

  it("reads nested error object message", () => {
    const err = axiosResponseError(401, {
      error: { message: "Unauthorized" },
    });
    expect(getRequestErrorMessage(err)).toBe(
      "Request failed (401): Unauthorized",
    );
  });

  it("returns network-style message when response has no status", () => {
    const err = new AxiosError(
      "timeout",
      "ECONNABORTED",
      {} as InternalAxiosRequestConfig,
    );
    expect(getRequestErrorMessage(err)).toContain("Network error");
  });

  it("returns Error message for plain Error", () => {
    expect(getRequestErrorMessage(new Error("oops"))).toBe("oops");
  });

  it("returns fallback for unknown", () => {
    expect(getRequestErrorMessage(null)).toBe("Something went wrong");
  });
});
