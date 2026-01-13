import { Button } from "@/components/ui/button";
import { CSVLink } from "react-csv";

const SalesReportByProductExcel = ({ data }: any) => {
  if (!data || !data.length) {
    return (
      <Button disabled variant={"secondary"} size="xs">
        Excel
      </Button>
    );
  }

  // Prepare data for CSV export
  const combinedData = data.map((product: any) => {
    // Calculate price per item (totalPrice / quantity)
    const pricePerItem = product.quantity ? product.totalPrice / product.quantity : 0;

    return {
      "Product Name": product.productName,
      "Size": product.size || "N/A",
      "Chipset": product.chipset || "N/A",
      "Connectivity": product.connectivity || "N/A",
      "Connector": product.connector || "N/A",
      "Material": product.material || "N/A",
      "Plug": product.plug || "N/A",
      "Region": product.region || "N/A",
      "ROM": product.rom || "N/A",
      "RAM": product.ram || "N/A",
      "SIM": product.sim || "N/A",
      "Quantity": product.quantity,
      "Price Per Item": pricePerItem + " ৳",
      "Total Price": product.totalPrice + " ৳",
    };
  });

  // Prepare CSV headers
  const headers = [
    { label: "Product Name", key: "Product Name" },
    { label: "Size", key: "Size" },
    { label: "Chipset", key: "Chipset" },
    { label: "Connectivity", key: "Connectivity" },
    { label: "Connector", key: "Connector" },
    { label: "Material", key: "Material" },
    { label: "Plug", key: "Plug" },
    { label: "Region", key: "Region" },
    { label: "ROM", key: "ROM" },
    { label: "RAM", key: "RAM" },
    { label: "SIM", key: "SIM" },
    { label: "Quantity", key: "Quantity" },
    { label: "Price Per Item", key: "Price Per Item" },
    { label: "Total Price", key: "Total Price" },
  ];

  return (
    <CSVLink
      data={combinedData}
      headers={headers}
      filename={"sales_report_by_product.csv"}
      className="no-underline"
    >
      <Button variant={"outline"} size="sm" className="p-3">
        Excel
      </Button>
    </CSVLink>
  );
};

export default SalesReportByProductExcel;
