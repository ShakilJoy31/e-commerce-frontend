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
// import Barcode from "react-barcode";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    width: "200mm",
    height: "279mm",
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "auto",
    objectFit: "cover",
    opacity: 1,
  },
  content: {
    position: "relative",
    marginTop: 50,
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
    fontSize: 10,
    fontWeight: "bold",
    backgroundColor: "#ffffff",
    paddingHorizontal: 6,
    paddingVertical: 3,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 12,
    textAlign: "center",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 10,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: "light",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
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
    fontSize: 8,
  },
  infoCellRight: {
    flex: 2,
    padding: 4,
    fontSize: 8,
  },
  billingTitle: {
    marginTop: 5,
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  productsHeader: {
    fontWeight: "bold",
    fontSize: 11,
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
    width: "40%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    fontSize: 8,
  },
  colWarranty: {
    width: "15%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    fontSize: 8,
    textAlign: "center",
  },
  col: {
    width: "15%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    fontSize: 8,
    textAlign: "center",
  },
  colLast: {
    width: "15%",
    padding: 4,
    fontSize: 8,
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
    fontSize: 8,
    textAlign: "right",
  },
  summaryValue: {
    width: "15%",
    padding: 4,
    fontSize: 8,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 8,
    textAlign: "left",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 8,
  },
  appreciationText: {
    fontSize: 10,
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
});

const PDFInvoice = ({ data }) => {
  const order = data;
  const shipping = order?.OrderShippingInfo?.[0] || {};
  const items = order?.OrderItem || [];

  // Helper function to get variation details
  const getVariationDetails = (item) => {
    const variation =
      item.variationProduct || item.product?.VariationProduct?.[0];
    if (!variation) return null;

    const details: string[] = [];
    if (variation.ram) details.push(`${variation.ram}GB RAM`);
    if (variation.rom) details.push(`${variation.rom}GB ROM`);
    if (variation.size) details.push(`Size: ${variation.size}`);
    if (variation.sim) details.push(`SIM: ${variation.sim}`);
    if (variation.region) details.push(`Region: ${variation.region}`);
    if (variation.chipset) details.push(`Chipset: ${variation.chipset}`);
    if (item.productColor?.color?.color)
      details.push(`Color: ${item.productColor.color.color}`);

    return details.length > 0 ? details.join(", ") : null;
  };

  // Calculate totals
  const totalExtraWarranty = items.reduce((total, item) => {
    return total + (item.extraWarranty?.price || 0) * item.quantity;
  }, 0);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // const discountType = order?.discountType;
  const discount = order?.couponDiscount || 0;
  const pointDiscount = order?.totalPointDiscount || 0;

  // let discountAmount;
  // if (discountType === "FIXED") {
  //   discountAmount = discount;
  // } else {
  //   discountAmount = subtotal * (discount / 100);
  // }

  const shippingFee = order?.shippingCharge || 0;
  const gatewayCharge = order?.gatewayChargeAmount || 0;
  const payment = order?.paymentAmount || 0;
  // const total = subtotal + shippingFee + gatewayCharge;
  const due = order?.totalAmount - payment;
  const total =
    subtotal + shippingFee + gatewayCharge + order?.conditionFee || 0;
  const orderDate = order?.createdAt
    ? format(new Date(order.createdAt), "dd/MM/yyyy hh:mm a")
    : "N/A";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Background Image */}
        {appConfiguration?.invoiceBanner && (
          <Image
            src={appConfiguration.invoiceBanner}
            style={styles.backgroundImage}
            fixed
          />
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>{/* Optional date/time display */}</View>
            <View style={styles.barcodeContainer}>
              <Text style={styles.orderId}>
                {order?.orderId || "404NOTFOUND"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Invoice title */}
          <Text style={styles.invoiceTitle}>Invoice</Text>

          {/* Customer and Order Information */}
          <View style={styles.infoContainer}>
            {/* Shipping Information */}
            <View style={styles.infoBox}>
              <Text style={styles.infoHeader}>Shipping Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoCellLeft}>Name</Text>
                <Text style={styles.infoCellRight}>
                  {shipping?.name || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoCellLeft}>Mobile No</Text>
                <Text style={styles.infoCellRight}>
                  {shipping?.phone?.replace(/^(\+88)/, "") || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoCellLeft}>Shipping Method</Text>
                <Text style={styles.infoCellRight}>
                  {order?.shippingMethod || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoCellLeft}>City</Text>
                <Text style={styles.infoCellRight}>
                  {shipping?.area || ""},{shipping?.zone || ""},{" "}
                  {shipping?.city || ""}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoCellLeft}>Address</Text>
                <Text style={styles.infoCellRight}>
                  {shipping?.address || "N/A"}
                </Text>
              </View>
            </View>

            {/* Order Information */}
            <View style={styles.infoBox}>
              <Text style={styles.infoHeader}>Order #: {order?.orderId}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoCellLeft}>Order Date</Text>
                <Text style={styles.infoCellRight}>{orderDate}</Text>
              </View>
              <Text style={styles.billingTitle}>Billing Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoCellLeft}>Payment Method</Text>
                <Text style={styles.infoCellRight}>
                  {order?.paymentMethod || "N/A"}
                </Text>
              </View>

              {/* IMEI/Serial Number Fields */}
              {items.some((item) => item.imei || item.serialNo) && (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoCellLeft}>IMEI/Serial No</Text>
                    <Text style={styles.infoCellRight}>
                      {items.map((item, idx) => (
                        <Text key={idx}>
                          {item.imei && `IMEI: ${item.imei}`}
                          {item.serialNo && `Serial: ${item.serialNo}`}
                          {!item.imei && !item.serialNo && "N/A"}
                          {idx < items.length - 1 && "\n"}
                        </Text>
                      ))}
                    </Text>
                  </View>
                </>
              )}

              <View style={styles.infoRow}>
                <Text style={styles.infoCellLeft}>Payment Status</Text>
                <Text style={styles.infoCellRight}>
                  {order?.paymentStatus ? "Paid" : "Pending"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoCellLeft}>Order Status</Text>
                <Text style={styles.infoCellRight}>{order?.orderStatus}</Text>
              </View>
            </View>
          </View>

          {/* Products Information */}
          <Text style={styles.productsHeader}>Product(s)</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.colName}>Name</Text>
              <Text style={styles.colWarranty}>Warranty</Text>
              <Text style={styles.col}>Price</Text>
              <Text style={styles.col}>Qty</Text>
              <Text style={styles.colLast}>Total</Text>
            </View>

            {/* Table Rows with Variations */}
            {items.map((item, idx) => {
              const variationDetails = getVariationDetails(item);
              return (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.colName}>
                    {item.product?.productName || "Unknown"}
                    {variationDetails && (
                      <Text style={{ fontSize: 8, color: "#555" }}>
                        {"\n"}({variationDetails})
                      </Text>
                    )}
                  </Text>
                  <Text style={styles.colWarranty}>
                    {item?.extraWarranty?.name || "3 Months"}
                  </Text>
                  <Text style={styles.col}>BDT {item.price}</Text>
                  <Text style={styles.col}>{item.quantity}</Text>
                  <Text style={styles.colLast}>
                    BDT {item.price * item.quantity}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Summary Table with Gateway Charge */}
          <View style={styles.table}>
            {totalExtraWarranty > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Extra Warranty:</Text>
                <Text style={styles.summaryValue}>
                  BDT {totalExtraWarranty}
                </Text>
              </View>
            )}

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sub-total:</Text>
              <Text style={styles.summaryValue}>BDT {subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping:</Text>
              <Text style={styles.summaryValue}>BDT {shippingFee}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Gateway Charge:</Text>
              <Text style={styles.summaryValue}>BDT {gatewayCharge}</Text>
            </View>

            <View style={[styles.summaryRow, styles.bold]}>
              <Text style={styles.summaryLabel}>Order total:</Text>
              <Text style={styles.summaryValue}>BDT {total}</Text>
            </View>
            <View style={[styles.summaryRow, styles.bold]}>
              <Text style={styles.summaryLabel}>Coupon discount:</Text>
              <Text style={styles.summaryValue}>- BDT {discount}</Text>
            </View>
            {pointDiscount && pointDiscount > 0 ? (
              <>
                {" "}
                <View style={[styles.summaryRow, styles.bold]}>
                  <Text style={styles.summaryLabel}>Point discount:</Text>
                  <Text style={styles.summaryValue}>- BDT {pointDiscount}</Text>
                </View>
              </>
            ) : (
              ""
            )}
            <View style={[styles.summaryRow, styles.bold]}>
              <Text style={styles.summaryLabel}>Grand Total</Text>
              <Text style={styles.summaryValue}>BDT {order?.totalAmount}</Text>
            </View>
            <View style={[styles.summaryRow, styles.bold]}>
              <Text style={styles.summaryLabel}>Total Payments</Text>
              <Text style={styles.summaryValue}>BDT {payment}</Text>
            </View>
            {order?.conditionFee ? (
              <View style={[styles.summaryRow, styles.bold]}>
                <Text style={styles.summaryLabel}>Condition Fee:</Text>
                <Text style={styles.summaryValue}>
                  BDT {order?.conditionFee}
                </Text>
              </View>
            ) : null}
            {due > 0 ? (
              <View style={[styles.summaryRow, styles.bold]}>
                <Text style={styles.summaryLabel}>Due</Text>
                <Text style={styles.summaryValue}>BDT {due}</Text>
              </View>
            ) : (
              ""
            )}
          </View>

          {/* Footer */}
          <Text style={styles.footerText}>Vat & Tax are included on MRP.</Text>

          <Text style={styles.appreciationText}>
            We appreciate you choosing {appConfiguration?.appName}. Your
            satisfaction is of the utmost importance to us. Should you have any
            inquiries or require assistance, please do not hesitate to contact
            us through the email address or hotline number provided below.
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

export default PDFInvoice;
