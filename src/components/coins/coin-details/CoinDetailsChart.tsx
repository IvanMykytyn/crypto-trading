import { lazy, Suspense } from "react";

const CoinLineChart = lazy(() =>
  import("../coin-line-chart/CoinLineChart").then((m) => ({
    default: m.CoinLineChart,
  })),
);

type Props = {
  coinId: string;
};

export function CoinDetailsChart({ coinId }: Props) {
  return (
    <div className="mt-6 h-[260px] w-full md:h-[500px]">
      <Suspense
        fallback={
          <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-body">
            Loading chart…
          </div>
        }
      >
        <CoinLineChart id={coinId} />
      </Suspense>
    </div>
  );
}
