import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
// import { useRef } from "react";
import PDFReturnInvoice from "./PDFReturnInvoice";
// import { useReactToPrint } from "react-to-print";
// import OrderInvoicePrintSingle from "../order/OrderInvoicePrintSingle";

const PrintReturnOrder = ({ data }) => {
  // const invoiceRef = useRef<HTMLDivElement>(null);
  // const reactToPrintInvoice = useReactToPrint({ contentRef: invoiceRef });

  return (
    <div className="flex gap-2">
      {/* <Button
        onClick={() => reactToPrintInvoice()}
        variant="secondary"
        className="w-full flex justify-start p-1"
        size="xs"
      >
        Print Invoice
      </Button>

      <div className="invisible hidden -left-full">
        {data && <OrderInvoicePrintSingle ref={invoiceRef} orderData={data} />}
      </div> */}
      <PDFDownloadLink
        document={<PDFReturnInvoice data={data} />}
        fileName={`return_invoice_${data?.returnId || "unknown"}.pdf`}
      >
        {({ loading }) => (
          <Button
            variant={"outline"}
            className="text-xl font-semibold text-primary"
            disabled={loading}
          >
            {loading ? "Preparing PDF..." : "Download PDF"}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default PrintReturnOrder;
