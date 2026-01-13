import { Button } from "@/components/ui/button";
import { CSVLink } from "react-csv";

const SalesReportByOrderExcel = ({ data }: any) => {
  if (!data || !data.length) {
    return (
      <Button disabled variant={"secondary"} size="xs">
        Excel
      </Button>
    );
  }

  // Prepare data for CSV export
  const combinedData = data.map((order: any) => ({
    "Order ID": order.orderId,
    "Name": order.user?.name || "N/A",
    "Contact No": order.user?.contactNo || "N/A",
    "Discount Amount": order.discountAmount,
    "Shipping Charge": order.shippingCharge,
    "Total Amount": order.totalAmount,
  }));

  // Prepare CSV headers
  const headers = [
    { label: "Order ID", key: "Order ID" },
    { label: "Name", key: "Name" },
    { label: "Contact No", key: "Contact No" },
    { label: "Discount Amount", key: "Discount Amount" },
    { label: "Shipping Charge", key: "Shipping Charge" },
    { label: "Total Amount", key: "Total Amount" },
  ];

  return (
    <CSVLink
      data={combinedData}
      headers={headers}
      filename={"sales_report.csv"}
      className="no-underline"
    >
      <Button variant={"outline"} size="sm" className="p-3">
        Excel
      </Button>
    </CSVLink>
  );
};

export default SalesReportByOrderExcel;
