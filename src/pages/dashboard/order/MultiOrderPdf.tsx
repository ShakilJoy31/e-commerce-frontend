import { Document, Page } from "@react-pdf/renderer";
import PDFInvoice from "@/pages/public/myAccount/PDFInvoice"; 

const MultiOrderPDF = ({ orders }) => {
  return (
    <Document>
      {orders?.length > 0 && orders?.map((order, index) => (
        <Page key={index} size="A4" style={{ padding: 30 }}>
          <PDFInvoice data={order} />
        </Page>
      ))}
    </Document>
  );
};

export default MultiOrderPDF;