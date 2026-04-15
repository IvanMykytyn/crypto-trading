type CustomTooltipProps = {
  active?: boolean;
  payload?: { value?: number }[];
  label?: number;
};

export const CustomCoinChartTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }
  const priceValue = payload[0]?.value;
  if (priceValue == null || label == null) {
    return null;
  }
  const when = new Date(label).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });
  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <div className="text-xs text-slate-500">{when} UTC</div>
      <div className="text-lg font-semibold text-slate-900">
        $
        {priceValue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: priceValue < 2 ? 6 : 3,
        })}
      </div>
    </div>
  );
};
