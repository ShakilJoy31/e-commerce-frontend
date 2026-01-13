import { appConfiguration } from "@/utils/constant/appConfiguration";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 10,
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
    fontWeight: "semibold",
  },
  subHeading: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
    width: "100%",
  },
  tableHeader: {
    width: "16.6%", // Adjust the width for better distribution
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: "8px",
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 3,
    paddingHorizontal: 2,
  },
  tableCol: {
    width: "16.6%", // Adjust the width to match header columns
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: "8px",
    textAlign: "center",
    paddingVertical: 3,
    paddingHorizontal: 2,
  },
});

const SalesReportByOrderPdf = ({ data }: any) => {
  // Format the current date
  const currentDate = format(new Date(), "MMMM dd, yyyy");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* SALES REPORT HEADER */}
        <View style={styles.section}>
          <Text style={styles.heading}>{appConfiguration.appName}</Text>
          <Text style={styles.subHeading}>Sales Report By Order</Text>
          <Text style={styles.subHeading}>Date: {currentDate}</Text>
        </View>

        {/* SALES REPORT TABLE */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableHeader}>
              <Text>Order ID</Text>
            </View>
            <View style={styles.tableHeader}>
              <Text>Name</Text>
            </View>
            <View style={styles.tableHeader}>
              <Text>Contact No</Text>
            </View>
            <View style={styles.tableHeader}>
              <Text>Discount Amount</Text>
            </View>
            <View style={styles.tableHeader}>
              <Text>Shipping Charge</Text>
            </View>
            <View style={styles.tableHeader}>
              <Text>Total Amount</Text>
            </View>
          </View>

          {/* Table Data */}
          {data?.map((order: any, index: any) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text>{order.orderId}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{order.user?.name || "N/A"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{order.user?.contactNo || "N/A"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{order.discountAmount}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{order.shippingCharge}</Text>
              </View>
              <View style={styles.tableCol}>
                {/* Ensure totalAmount is available */}
                <Text>{order.totalAmount}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default SalesReportByOrderPdf;
