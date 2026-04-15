import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

export type AnimatedNumberProps = {
  value: number | null | undefined;
  suffix?: string;
  className?: string;
  locale?: Intl.LocalesArgument;
  formatOptions?: Intl.NumberFormatOptions;
};

export function AnimatedNumber({
  value,
  suffix = "",
  className,
  locale,
  formatOptions,
}: AnimatedNumberProps) {
  const prev = useRef<number | undefined>(undefined);
  const [tick, setTick] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (value == null || !Number.isFinite(value)) {
      prev.current = undefined;
      return;
    }

    const before = prev.current;
    prev.current = value;
    if (before === undefined || before === value) {
      return;
    }

    const up = value > before;
    const flash = window.setTimeout(() => setTick(up ? "up" : "down"), 0);
    const off = window.setTimeout(() => setTick(null), 400);
    return () => {
      window.clearTimeout(flash);
      window.clearTimeout(off);
    };
  }, [value]);

  const text =
    value == null || !Number.isFinite(value)
      ? "—"
      : value.toLocaleString(locale, formatOptions) + suffix;

  return (
    <span
      className={clsx(
        "tabular-nums transition-colors duration-300 ease-out",
        tick === "up" && "text-emerald-600",
        tick === "down" && "text-rose-600",
        className,
      )}
    >
      {text}
    </span>
  );
}
