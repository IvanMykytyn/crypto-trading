import { useEffect, useState } from "react";

import { FIAT_CURRENCY_CODE_EUR } from "../../../constants/market";
import { roundCoinQuantity, roundEurAmount } from "../../../utils/money";
import { Button } from "../../shared/Button";
import { NumberInput } from "../../shared/NumberInput";
import { useAppDispatch } from "../../../store/hooks";
import { placeBuy, placeSell } from "../../../store/tradeThunks";

type Props = {
  coinId: string;
  coinSymbol: string;
  /** Live EUR price per coin; required to size trades */
  priceEur: number | undefined;
  /** Set when the live price request failed (e.g. rate limit). */
  priceFetchError?: string | null;
};

function parseAmount(value: string | number): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  const n = parseFloat(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

/** Avoid overwriting the other field while the decimal point has no fraction yet. */
function isIncompleteDecimal(value: string | number): boolean {
  return typeof value === "string" && /\.$/.test(value.trim());
}

export const CoinTradePanel: React.FC<Props> = ({
  coinId,
  coinSymbol,
  priceEur,
  priceFetchError = null,
}) => {
  const dispatch = useAppDispatch();
  const [eurAmount, setEurAmount] = useState<string | number>("");
  const [coinAmount, setCoinAmount] = useState<string | number>("");
  const [error, setError] = useState<string | null>(null);

  const priceReady = typeof priceEur === "number" && priceEur > 0;

  useEffect(() => {
    if (!priceReady || priceEur === undefined) return;
    const eur = parseAmount(eurAmount);
    const coin = parseAmount(coinAmount);
    const id = requestAnimationFrame(() => {
      if (eur > 0 && coin <= 0) {
        setCoinAmount(roundCoinQuantity(eur / priceEur));
      } else if (coin > 0 && eur <= 0) {
        setEurAmount(roundEurAmount(coin * priceEur));
      }
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-sync when price becomes usable, not on each keystroke
  }, [priceReady, priceEur]);

  function handleEurChange(value: string | number) {
    setEurAmount(value);
    setError(null);
    if (!priceReady || priceEur === undefined) return;

    if (typeof value === "string" && value.trim() === "") {
      setCoinAmount("");
      return;
    }
    if (isIncompleteDecimal(value)) return;

    const eur = parseAmount(value);
    if (eur <= 0) {
      setCoinAmount("");
      return;
    }
    setCoinAmount(roundCoinQuantity(eur / priceEur));
  }

  function handleCoinChange(value: string | number) {
    setCoinAmount(value);
    setError(null);
    if (!priceReady || priceEur === undefined) return;

    if (typeof value === "string" && value.trim() === "") {
      setEurAmount("");
      return;
    }
    if (isIncompleteDecimal(value)) return;

    const coin = parseAmount(value);
    if (coin <= 0) {
      setEurAmount("");
      return;
    }
    setEurAmount(roundEurAmount(coin * priceEur));
  }

  function resolveAmounts(): {
    eur: number;
    coin: number;
    price: number;
  } | null {
    if (!priceReady || priceEur === undefined) return null;
    const eur = parseAmount(eurAmount);
    const coin = parseAmount(coinAmount);
    if (eur <= 0 || coin <= 0) return null;
    return {
      eur: roundEurAmount(eur),
      coin: roundCoinQuantity(coin),
      price: priceEur,
    };
  }

  async function handleBuy() {
    setError(null);
    const resolved = resolveAmounts();
    if (!resolved) {
      setError(
        `Enter an amount in ${FIAT_CURRENCY_CODE_EUR} or in coins (price must be positive).`,
      );
      return;
    }
    const result = await dispatch(
      placeBuy({
        coinId,
        coinSymbol,
        priceEurPerCoin: resolved.price,
        eurAmount: resolved.eur,
        coinAmount: resolved.coin,
      }),
    );
    if (placeBuy.rejected.match(result)) {
      setError(result.payload ?? "Buy failed.");
      return;
    }
    setEurAmount("");
    setCoinAmount("");
  }

  async function handleSell() {
    setError(null);
    const resolved = resolveAmounts();
    if (!resolved) {
      setError(
        `Enter an amount in ${FIAT_CURRENCY_CODE_EUR} or in coins (price must be loaded).`,
      );
      return;
    }
    const result = await dispatch(
      placeSell({
        coinId,
        coinSymbol,
        priceEurPerCoin: resolved.price,
        eurAmount: resolved.eur,
        coinAmount: resolved.coin,
      }),
    );
    if (placeSell.rejected.match(result)) {
      setError(result.payload ?? "Sell failed.");
      return;
    }
    setEurAmount("");
    setCoinAmount("");
  }

  return (
    <div className="relative">
      {!priceReady && (
        <p
          className={`mb-2 text-xs ${priceFetchError ? "text-red-600" : "text-body"}`}
        >
          {priceFetchError ?? "Waiting for live price…"}
        </p>
      )}
      <div className="flex flex-col gap-3">
        <NumberInput
          value={coinAmount}
          onChange={handleCoinChange}
          placeholder="0"
          label={coinSymbol?.slice(0, 3)?.toUpperCase() ?? ""}
        />
        <NumberInput
          value={eurAmount}
          onChange={handleEurChange}
          placeholder="0"
          label={FIAT_CURRENCY_CODE_EUR}
        />
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
      <div className="mt-6 flex w-full flex-nowrap gap-6">
        <Button
          variant="filled"
          color="btn"
          size="lg"
          fullWidth
          disabled={!priceReady}
          onClick={handleBuy}
        >
          Buy
        </Button>
        <Button
          variant="filled"
          color="btn"
          size="lg"
          fullWidth
          disabled={!priceReady}
          onClick={handleSell}
        >
          Sell
        </Button>
      </div>
    </div>
  );
};
