import { useMemo } from "react";

import {
  eurPriceFormatOptions,
  formatSignedEurChange,
} from "../../../utils/currency";
import { AnimatedNumber } from "../../shared/AnimatedNumber";

type Props = {
  coinId: string;
  name: string;
  symbolUpper: string;
  imageLarge: string;
  price?: number;
  priceErrorMessage: string | null;
  priceChangeEur?: number;
};

export function CoinDetailsTitleAndPrice({
  coinId,
  name,
  symbolUpper,
  imageLarge,
  price,
  priceErrorMessage,
  priceChangeEur,
}: Props) {
  const priceChange = useMemo(() => {
    const change = priceChangeEur ?? 0;
    return {
      label: formatSignedEurChange(change),
      className: change > 0 ? "text-green-500" : "text-red-500",
    };
  }, [priceChangeEur]);

  return (
    <>
      <div className="hidden items-center gap-2 md:flex">
        <img src={imageLarge} alt={name} className="h-8 w-8" />
        <h1 className="text-2xl font-semibold text-body">
          {name} ({symbolUpper})
        </h1>
      </div>
      <h1 className="text-2xl font-semibold text-body md:hidden">
        {symbolUpper}
      </h1>
      <h2 className="text-2xl font-semibold text-body">
        {price != null ? (
          <AnimatedNumber
            key={coinId}
            value={price}
            formatOptions={eurPriceFormatOptions(price)}
          />
        ) : null}
      </h2>
      {priceErrorMessage ? (
        <p className="mt-1 max-w-md text-center text-xs text-red-600 md:text-left">
          {priceErrorMessage}
        </p>
      ) : null}
      <p className="mt-3 text-xs text-body md:mt-2">
        PnL: <span className={priceChange.className}>{priceChange.label}</span>
      </p>
    </>
  );
}
