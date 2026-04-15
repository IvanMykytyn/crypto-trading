import axios, { type AxiosInstance } from "axios";

export type CreateApiClientOptions = {
  baseURL: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
};

export function createApiClient(
  options: CreateApiClientOptions,
): AxiosInstance {
  const { baseURL, headers = {}, timeoutMs = 15_000 } = options;

  return axios.create({
    baseURL,
    timeout: timeoutMs,
    headers: { ...headers },
  });
}
