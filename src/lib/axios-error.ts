import { isAxiosError } from "axios";

const DETAIL_MAX_LEN = 200;

function truncateDetail(text: string, max = DETAIL_MAX_LEN): string {
  const t = text.trim();
  if (!t) return "";
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function pickString(...candidates: unknown[]): string | null {
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) {
      return c.trim();
    }
  }
  return null;
}

/**
 * Pull a human-readable fragment from typical JSON error bodies
 * (CoinGecko, generic `{ message }`, RFC7807-ish `{ title, detail }`, nested `{ error }`).
 * Returns empty string when nothing useful is found (caller may omit ": …").
 */
function extractDetailBody(data: unknown): string {
  if (typeof data === "string") {
    return truncateDetail(data);
  }
  if (!isRecord(data)) {
    return "";
  }

  const body = pickString(
    data.message,
    data.detail,
    data.title,
    typeof data.error === "string" ? data.error : null,
  );
  if (body) {
    return truncateDetail(body);
  }

  if (isRecord(data.error)) {
    const nested = pickString(
      data.error.message,
      data.error.title,
      data.error.detail,
      typeof data.error.error === "string" ? data.error.error : null,
    );
    if (nested) {
      return truncateDetail(nested);
    }
  }

  if (isRecord(data.status)) {
    const fromStatus = pickString(
      data.status.error_message,
      data.status.message,
    );
    if (fromStatus) {
      return truncateDetail(fromStatus);
    }
  }

  if (Array.isArray(data.errors)) {
    const parts: string[] = [];
    for (const item of data.errors) {
      if (typeof item === "string" && item.trim()) {
        parts.push(item.trim());
      } else if (isRecord(item)) {
        const msg = pickString(item.message, item.detail, item.title);
        if (msg) {
          parts.push(msg);
        }
      }
      if (parts.join(", ").length >= DETAIL_MAX_LEN) {
        break;
      }
    }
    if (parts.length) {
      return truncateDetail(parts.join(", "));
    }
  }

  return "";
}

function detailFromResponseData(data: unknown): string {
  const body = extractDetailBody(data);
  return body ? `: ${body}` : "";
}

export function getRequestErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const detail = detailFromResponseData(error.response?.data);
    if (status) {
      return `Request failed (${status})${detail}`;
    }
    return `Network error${error.message ? `: ${error.message}` : ""}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
}
