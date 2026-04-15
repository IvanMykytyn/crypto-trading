import { NavLink } from "react-router";
import { clsxm } from "../../theme/clsxm";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  clsxm(
    "rounded-md px-2 py-1.5 text-sm font-medium no-underline transition-colors",
    isActive ? "text-logo" : "text-body hover:bg-black/[0.04] hover:text-ink",
  );

export function NavbarNavLinks() {
  return (
    <nav
      aria-label="Main"
      className="flex min-w-0 flex-wrap items-center gap-1 sm:gap-2"
    >
      <NavLink to="/dashboard" className={linkClass} end>
        Dashboard
      </NavLink>
      <NavLink to="/my-orders" className={linkClass}>
        My Orders
      </NavLink>
    </nav>
  );
}
