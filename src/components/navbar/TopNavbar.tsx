import { AccountMenu } from "./AccountMenu";
import { NavbarNavLinks } from "./NavbarNavLinks";
import { NavbarSearch } from "./NavbarSearch";

export function TopNavbar() {
  return (
    <div className="flex h-full items-center px-4">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_auto] items-center gap-2 [grid-template-areas:'nav_account'_'search_search'] md:grid-cols-[auto_minmax(0,1fr)_auto] md:grid-rows-1 md:gap-4 md:[grid-template-areas:'nav_search_account']">
        <div className="min-w-0 [grid-area:nav] justify-self-start">
          <NavbarNavLinks />
        </div>
        <div className="[grid-area:account] justify-self-end">
          <AccountMenu />
        </div>
        <div className="w-full min-w-0 max-w-xl justify-self-stretch [grid-area:search] max-md:rounded-md max-md:border max-md:border-navbar-border max-md:bg-search-well max-md:p-2 md:mx-auto md:max-w-xl md:justify-self-center">
          <NavbarSearch />
        </div>
      </div>
    </div>
  );
}
