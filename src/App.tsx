import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { AppLayout } from "./components/layout/AppLayout";
import { ROUTE_SEGMENT } from "./constants/routes";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const CoinDetails = lazy(() => import("./pages/CoinDetails"));

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route
          index
          element={<Navigate to={ROUTE_SEGMENT.dashboard} replace />}
        />
        <Route path={ROUTE_SEGMENT.dashboard} element={<Dashboard />} />
        <Route path={ROUTE_SEGMENT.myOrders} element={<MyOrders />} />
        <Route
          path={ROUTE_SEGMENT.coin}
          element={<Navigate to={ROUTE_SEGMENT.dashboard} replace />}
        />
        <Route path={`${ROUTE_SEGMENT.coin}/:id`} element={<CoinDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
