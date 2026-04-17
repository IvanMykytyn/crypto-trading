import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { COINGECKO_VS_CURRENCY_EUR } from "../../../constants/market";
import { formatEurPrice } from "../../../utils/currency";
import { useCoinMarketChart } from "../../../hooks/useCoinMarketChart";
import { getRequestErrorMessage } from "../../../lib/axios-error";
import { CustomCoinChartTooltip } from "./CustomCoinChartTooltip";

type PriceChartRow = { time: number; price: number };

type CoinLineChartProps = {
  id: string;
};

export const CoinLineChart = ({ id }: CoinLineChartProps) => {
  const {
    data: chartRaw,
    isLoading,
    isFetching,
    isError,
    error,
  } = useCoinMarketChart(id, {
    vs_currency: COINGECKO_VS_CURRENCY_EUR,
    days: 1,
  });

  /** CoinGecko returns `[ms, price][]`; Recharts needs `{ time, price }[]`. */
  const chartData = useMemo((): PriceChartRow[] => {
    const tuples = chartRaw?.prices;
    if (!tuples?.length) {
      return [];
    }
    return tuples.map(([time, price]) => ({ time, price }));
  }, [chartRaw?.prices]);

  const { yMin, yMax } = useMemo(() => {
    if (chartData.length === 0) {
      return { yMin: 0, yMax: 1 };
    }
    const prices = chartData.map((d) => d.price);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    const span = maxP - minP || Math.abs(maxP) * 0.02 || 1;
    const pad = span * 0.06;
    return { yMin: minP - pad, yMax: maxP + pad };
  }, [chartData]);

  const formatYAxis = (value: number) => formatEurPrice(value);

  if (isError) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center px-4 text-center text-sm text-red-600">
        {getRequestErrorMessage(error)}
      </div>
    );
  }

  const chartHasPoints = chartData.length > 0;
  if (!chartHasPoints && (isLoading || isFetching)) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-body">
        Loading chart…
      </div>
    );
  }

  if (!chartHasPoints) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center px-4 text-center text-sm text-body">
        No price data for this range.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 20, right: 12, left: 4, bottom: 4 }}
      >
        <defs>
          <linearGradient id="fadingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--app-chart-fade)"
              stopOpacity={0.55}
            />
            <stop
              offset="45%"
              stopColor="var(--app-chart-fade)"
              stopOpacity={0.25}
            />
            <stop
              offset="100%"
              stopColor="var(--app-chart-fade)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="4 6"
          stroke="#e2e8f0"
          strokeOpacity={0.6}
          vertical={false}
        />

        <XAxis
          dataKey="time"
          type="number"
          domain={["dataMin", "dataMax"]}
          scale="time"
          hide
        />

        <YAxis
          orientation="right"
          domain={[yMin, yMax]}
          tickFormatter={formatYAxis}
          tick={{
            fill: "var(--app-chart-line)",
            fontSize: 11,
            fontWeight: 500,
          }}
          tickLine={false}
          axisLine={false}
          width={yMin < 0.01 ? 62 : 50}
          dx={6}
        />

        <Tooltip
          content={<CustomCoinChartTooltip />}
          cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4 4" }}
        />

        <Area
          type="monotone"
          dataKey="price"
          stroke="var(--app-chart-line)"
          strokeWidth={2}
          fill="url(#fadingGradient)"
          fillOpacity={1}
          activeDot={{
            r: 5,
            strokeWidth: 2,
            stroke: "#ffffff",
            fill: "var(--app-chart-line)",
          }}
          dot={(dotProps) => {
            const { cx, cy, index } = dotProps;
            const last = chartData.length - 1;
            if (index !== last || cx == null || cy == null || last < 0) {
              return null;
            }
            return (
              <circle
                cx={cx}
                cy={cy}
                r={5}
                fill="var(--app-chart-line)"
                stroke="#ffffff"
                strokeWidth={2}
              />
            );
          }}
          animationDuration={600}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
