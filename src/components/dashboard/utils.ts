export function pctChangeClass(pct: number | null | undefined): string {
  if (pct == null) {
    return "text-body";
  }
  if (pct > 0) {
    return "text-green-600";
  }
  if (pct < 0) {
    return "text-red-600";
  }
  return "text-body";
}
