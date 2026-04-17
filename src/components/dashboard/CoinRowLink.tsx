import { Link } from "react-router";

type Props = {
  to: string;
  imageUrl?: string | null;
  name: string;
  symbol: string;
  trailing?: React.ReactNode;
};

export const CoinRowLink: React.FC<Props> = ({
  to,
  imageUrl,
  name,
  symbol,
  trailing,
}) => {
  return (
    <Link
      to={to}
      className="flex w-full min-w-0 items-center justify-between gap-3 rounded-md p-2 transition-colors hover:bg-neutral-50"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-md object-cover bg-neutral-100"
          />
        ) : (
          <div
            className="size-8 shrink-0 rounded-md bg-neutral-100"
            aria-hidden
          />
        )}
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-ink">{name}</div>
          <div className="truncate text-xs text-body">{symbol}</div>
        </div>
      </div>
      {trailing != null ? (
        <div className="shrink-0 tabular-nums text-xs text-body">
          {trailing}
        </div>
      ) : null}
    </Link>
  );
};
