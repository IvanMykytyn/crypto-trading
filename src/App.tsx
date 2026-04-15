import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { AppLayout } from "./components/layout/AppLayout";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const CoinDetails = lazy(() => import("./pages/CoinDetails"));

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="my-orders" element={<MyOrders />} />
        <Route path="coin" element={<Navigate to="dashboard" replace />} />
        <Route path="coin/:id" element={<CoinDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
