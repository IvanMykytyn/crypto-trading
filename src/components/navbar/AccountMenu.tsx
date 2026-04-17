import { Avatar, Menu } from "@mantine/core";

import { FIAT_CURRENCY_CODE_EUR } from "../../constants/market";
import { formatEurPrice } from "../../utils/currency";
import { useAppSelector } from "../../store/hooks";
import { selectEurBalance } from "../../store/selectors";

function handleLogout(): void {
  /* Reserved: clear session / redirect when auth API exists */
}

export function AccountMenu() {
  const eurBalance = useAppSelector(selectEurBalance);

  return (
    <Menu shadow="md" width={220} position="bottom-end" withinPortal>
      <Menu.Target>
        <button
          type="button"
          aria-label="Account menu"
          className="flex max-w-full items-center gap-2 rounded-full border border-transparent p-0.5 text-left transition-colors hover:border-navbar-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo/40"
        >
          <span className="hidden max-w-40 truncate text-sm font-medium text-body sm:inline">
            Account
          </span>
          <Avatar color="btn" radius="xl" size="md" aria-hidden>
            AC
          </Avatar>
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Wallet</Menu.Label>
        <Menu.Item closeMenuOnClick={false} disabled>
          <span className="text-xs text-body">{FIAT_CURRENCY_CODE_EUR}</span>
          <span className="ml-2 font-medium text-ink">
            {formatEurPrice(eurBalance)}
          </span>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
