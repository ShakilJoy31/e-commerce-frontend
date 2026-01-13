import OrderStats from "./HeaderStats";
import OrderCycleTime from "./OrderCycleTime";
import OrdersOverTime from "./OrdersOverTime";
import RecentOrdersTable from "./RecentOrdersTable";
import SellInformation from "./SellInfo";
import SalesReport from "./SalesReport";
import OrderSource from "./OrderSource";
import OrderValueBySource from "./OrderValueBySource";
import TopSalesProduct from "./TopSalesProduct";
import OrderCountByLocation from "./OrderCountByLocation";
import OrderValueByLocation from "./OrderValueByLocation";
import ReturnProductByReason from "./ReturnProductByReason";
import CancelledOrderByReason from "./CancelOrderByReason";

export default function AdminHome() {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header Stats */}
      <OrderStats />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 lg:h-[350px]">
        <div className="lg:col-span-5">
          <SellInformation />
        </div>
        <div className="lg:col-span-7">
          <OrderCycleTime />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Orders Over Time */}
        <div className="lg:col-span-2">
          <OrdersOverTime />
        </div>

        {/* Last 7 Days Sales */}
        <SalesReport />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 lg:h-[450px]">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <RecentOrdersTable />
        </div>

        {/* Top Sales */}
        <OrderSource />
      </div>
      <div className="grid grid-cols-2 gap-6 mt-6">
        <OrderValueBySource />
        <TopSalesProduct />
      </div>
      <div className="grid grid-cols-2 gap-6 mt-6">
        <CancelledOrderByReason />
        <ReturnProductByReason />
      </div>
      <div className="grid grid-cols-2 gap-6 mt-6">
        <OrderCountByLocation />
        <OrderValueByLocation />
      </div>
    </div>
  );
}
