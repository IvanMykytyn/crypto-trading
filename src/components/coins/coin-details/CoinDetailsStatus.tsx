type ErrorBannerProps = {
  message: string;
};

export function CoinDetailsErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {message}
    </div>
  );
}

export function CoinDetailsPageLoading() {
  return (
    <div
      role="status"
      className="flex min-h-[40vh] items-center justify-center text-sm text-body"
    >
      Loading…
    </div>
  );
}
