import { useDisclosure } from "@mantine/hooks";
import { Button } from "../../shared/Button";
import { CoinTradePanel } from "./CoinTradePanel";
import { Modal } from "@mantine/core";

type Props = {
  coinId: string;
  coinSymbol: string;
  priceEur: number | undefined;
  priceFetchError?: string | null;
  className?: string;
};

export const CoinTradeModalButton: React.FC<Props> = ({
  coinId,
  coinSymbol,
  priceEur,
  priceFetchError = null,
  className,
}) => {
  const [tradeOpened, { open: openTrade, close: closeTrade }] =
    useDisclosure(false);
  return (
    <>
      <div className={className}>
        <Button
          variant="filled"
          color="btn"
          size="lg"
          fullWidth
          onClick={openTrade}
        >
          Trade
        </Button>
      </div>

      <Modal
        opened={tradeOpened}
        onClose={closeTrade}
        centered
        size="xs"
        radius="lg"
        withCloseButton={true}
        overlayProps={{ backgroundOpacity: 0.55 }}
        className="p-6 "
        styles={{
          inner: {
            left: 0,
            right: 0,
          },
          close: {
            height: 34,
            width: 34,
          },
          body: {
            padding: 24,
            paddingTop: 0,
          },
          header: {
            paddingBottom: 0,
            paddingTop: 0,
            minHeight: 46,
          },
        }}
      >
        <CoinTradePanel
          coinId={coinId}
          coinSymbol={coinSymbol}
          priceEur={priceEur}
          priceFetchError={priceFetchError}
        />
      </Modal>
    </>
  );
};
