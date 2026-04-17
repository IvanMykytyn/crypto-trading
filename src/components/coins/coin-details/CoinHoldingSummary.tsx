import { formatCoinAmount, formatEurPrice } from "../../../utils/currency";

type Props = {
  holding: number;
  eurBalance: number;
  coinSymbol: string;
};

export function CoinHoldingSummary({ holding, eurBalance, coinSymbol }: Props) {
  return (
    <p className="mt-1 w-full text-right text-xs text-body">
      Available:
      <br />
      <span className="font-medium text-ink">
        {formatCoinAmount(holding)}{" "}
        <span className="font-semibold">{coinSymbol}</span>
        <br />
        <span className="font-semibold">{formatEurPrice(eurBalance)}</span>
      </span>
    </p>
  );
}
