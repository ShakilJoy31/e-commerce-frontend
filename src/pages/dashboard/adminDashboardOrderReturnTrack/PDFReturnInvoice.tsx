import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { appConfiguration } from "@/utils/constant/appConfiguration";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
    width: "200mm",
    height: "279mm",
    position: "relative",
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    opacity: 1,
  },
  content: {
    position: 'relative',
    marginTop: 80,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  barcodeContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  orderId: {
    fontSize: 11,
    fontWeight: "bold",
    backgroundColor: "#ffffff",
    paddingHorizontal: 6,
    paddingVertical: 3,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 12,
    textAlign: "center"
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 10,
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: "light",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 24,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoBox: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  infoHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 4,
    fontWeight: "bold",
    fontSize: 11,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  infoCellLeft: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    fontWeight: "bold",
    fontSize: 10,
  },
  infoCellRight: {
    flex: 2,
    padding: 4,
    fontSize: 10,
  },
  billingTitle: {
    marginTop: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
  productsHeader: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 10,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  colName: {
    width: "30%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    fontSize: 10,
  },
  colSpec: {
    width: "15%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    fontSize: 10,
    textAlign: "center",
  },
  colWarranty: {
    width: "15%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    fontSize: 10,
    textAlign: "center",
  },
  col: {
    width: "10%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    fontSize: 10,
    textAlign: "center",
  },
  colLast: {
    width: "10%",
    padding: 4,
    fontSize: 10,
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  summaryLabel: {
    width: "85%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    fontSize: 10,
    textAlign: "right",
  },
  summaryValue: {
    width: "15%",
    padding: 4,
    fontSize: 10,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 10,
    textAlign: "left",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 8,
  },
  appreciationText: {
    fontSize: 11,
    lineHeight: 1.5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 8,
    marginTop: 16,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  signatureBox: {
    width: 200,
    borderTopWidth: 1,
    borderTopColor: "#000",
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
   reasonItem: {
    marginBottom: 20, // equivalent to mb-5 (tailwind's mb-5 is 1.25rem which is ~20px)
    fontSize: 10,
    paddingLeft: 10,
  },
});

const PDFReturnInvoice = ({ data }) => {
  const returnOrder = data;
  const order = returnOrder?.order || {};
  const shipping = order?.OrderShippingInfo?.[0] || {};
  const items = returnOrder?.ReturnItem || [];

  const returnDate = returnOrder?.createdAt
    ? format(new Date(returnOrder.createdAt), "dd/MM/yyyy hh:mm a")
    : "N/A";
  const orderDate = order?.createdAt
    ? format(new Date(order.createdAt), "dd/MM/yyyy hh:mm a")
    : "N/A";


  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Background Image at the bottom */}
        {appConfiguration?.invoiceBanner && (
          <Image
            src={appConfiguration.invoiceBanner}
            style={styles.backgroundImage}
            fixed
          />
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Header with order number and barcode placeholder */}
          <View style={styles.headerRow}>
            <View>
              <Text style={{ fontSize: 10 }}>Return Date & Time</Text>
              <Text style={{ fontSize: 10 }}>{returnDate}</Text>
            </View>
            <View style={styles.barcodeContainer}>
              <Text style={{ fontSize: 10 }}>[BARCODE: {order?.orderId || "404NOTFOUND"}]</Text>
             
            </View>
             <Text style={styles.orderId}>
                RETURN #{order?.orderId || "404NOTFOUND"}
              </Text>
          </View>

          <View style={styles.divider} />

          {/* Invoice title */}
          <Text style={styles.invoiceTitle}>Return Invoice</Text>

          {/* Customer and Order Information */}
          <View style={styles.infoContainer}>
            {/* Shipping Information */}
            <View style={styles.infoBox}>
              <Text style={styles.infoHeader}>Shipping Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoCellLeft}>Name</Text>
                <Text style={styles.infoCellRight}>{shipping?.name || "N/A"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoCellLeft}>Mobile No</Text>
                <Text style={styles.infoCellRight}>
                  {shipping?.phone?.replace(/^(\+88)/, "") || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoCellLeft}>Address</Text>
                <Text style={styles.infoCellRight}>
                  {shipping?.city || ""}, {shipping?.district || ""}, {shipping?.thana || ""},{" "}
                  {shipping?.address || "N/A"}
                </Text>
              </View>
            </View>

            {/* Return Information */}
            <View style={styles.infoBox}>
              <Text style={styles.infoHeader}>Order #: {order?.orderId}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoCellLeft}>Order Date</Text>
                <Text style={styles.infoCellRight}>{orderDate}</Text>
              </View>
              <Text style={styles.billingTitle}>Return Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoCellLeft}>Return Status</Text>
                <Text style={styles.infoCellRight}>
                  {returnOrder?.status || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoCellLeft}>Total Items</Text>
                <Text style={styles.infoCellRight}>
                  {items?.length || 0}
                </Text>
              </View>
            </View>
          </View>

          {/* Products Information */}
          <Text style={styles.productsHeader}>Return Product(s)</Text>
          {items.map((item, idx) => (
            <Text key={idx} style={styles.reasonItem}>
              <Text style={styles.bold}>Reason for return:</Text> {item?.reason || "Not specified"}
            </Text>
          ))}
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.colName}>Name</Text>
              <Text style={styles.colSpec}>Specs</Text>
              <Text style={styles.colSpec}>Color</Text>
              <Text style={styles.colWarranty}>Warranty</Text>
              <Text style={styles.col}>Price</Text>
              <Text style={styles.col}>Qty</Text>
              <Text style={styles.col}>Subtotal</Text>
            </View>

            {/* Table Rows */}
            {items.map((item, idx) => {
              const orderItem = item?.orderItem;
              const product = orderItem?.product;
              const variation = orderItem?.productColor?.variationProduct;
              
              return (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.colName}>
                    {product?.productName || "Unknown"}
                  </Text>
                  <Text style={styles.colSpec}>
                    {variation?.ram ?? "N/A"} {variation?.rom ? `/ ${variation.rom}` : ""}
                  </Text>
                  <Text style={styles.colSpec}>
                    {orderItem?.productColor?.color?.color || "N/A"}
                  </Text>
                  <Text style={styles.colWarranty}>
                    {orderItem?.extraWarranty?.name || "3 Months"}
                  </Text>
                  <Text style={styles.col}>BDT {orderItem?.price}</Text>
                  <Text style={styles.col}>{item?.quantity}</Text>
                  <Text style={styles.col}>BDT {item?.subTotal}</Text>
                </View>
              );
            })}
          </View>

          {/* Summary Table */}
          <View style={styles.table}>
            <View style={[styles.summaryRow, styles.bold]}>
              <Text style={styles.summaryLabel}>Total Return Amount:</Text>
              <Text style={styles.summaryValue}>BDT {returnOrder?.totalAmount}</Text>
            </View>
          </View>

          {/* Footer */}
          <Text style={styles.footerText}>Vat & Tax are included on MRP.</Text>
          
          <Text style={styles.appreciationText}>
            We appreciate you choosing {appConfiguration?.appName}. Your
            satisfaction is of the utmost importance to us. Should you
            have any inquiries or require assistance regarding your return,
            please do not hesitate to contact us through the email address 
            or hotline number provided below.
          </Text>
          
          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              <Text>Customer Signature</Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={{ textAlign: "right" }}>Authorized Signature</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};



const PDFDownloadButton = ({ data }) => (
  <PDFDownloadLink 
    document={<PDFReturnInvoice data={data} />} 
    fileName={`return_invoice_${data?.returnId || 'unknown'}.pdf`}
  >
    {({ loading }) => (
      <Button variant={"outline"} className="text-xl font-semibold text-primary" disabled={loading}>
        {loading ? 'Preparing PDF...' : 'PDF Invoice'}
      </Button>
    )}
  </PDFDownloadLink>
);



export default PDFReturnInvoice;
export { PDFDownloadButton };
