import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  useDeleteOrderMutation,
  useGetOrdersQuery,
} from "@/components/store/api/order/orderApi";
import { Button } from "@/components/ui/button";
import Table from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ChangeStatus from "./ChangeStatus";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import OrderInvoicePrintSingle from "./OrderInvoicePrintSingle";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFInvoice from "@/pages/public/myAccount/PDFInvoice";
import OrderPagination from "@/components/ui/OrderPagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { selectUser } from "@/components/store/store";
import { format } from "date-fns";
// import OrderDetails from "./OrderDetails";

const headers = [
  "SL",
  "Order",
  "Date",
  "Order by",
  "Name",
  "Phone",
  "Managed By",
  "Payment Status",
  "Order Status",
  "Total",
  "Action",
];
interface OrderListProps {
  handleTrustOrder: (order?: any) => void;
  selectedRow: any[];
  setSelectedRow: React.Dispatch<React.SetStateAction<any[]>>;
  filterBy:string;
  categoryId:any;
  from:any,
  to:any
}
const OrderList = ({ setSelectedRow, filterBy, categoryId, from, to }: OrderListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [actionItem, setActionItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const reactToPrintInvoice = useReactToPrint({ contentRef: invoiceRef });
  const user = useSelector(selectUser);

  useEffect(() => {
    if (selectedRows?.length > 0) {
      setSelectedRow(selectedRows);
    }
  }, [selectedRows, setSelectedRow]);

  const [pagination, setPagination] = useState({
    sort: "asc",
    page: 1,
    size: 100,
    meta: {
      page: null,
      size: null,
      total: null,
      totalPage: null,
    },
  });
  // Fetch orders dynamically
  const toYMD = (d?: Date | null) => (d ? format(d, "yyyy-MM-dd") : undefined);
  const type = "All";
  const { data, isLoading, isError } = useGetOrdersQuery({
    page: pagination.page,
    size: pagination.size,
    search: searchTerm || undefined,
    status: type,
    fromDate: toYMD(from),
    toDate: toYMD(to),
    filterBy: filterBy,
    categoryId: categoryId,
  });

  useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        meta: {
          page: data.meta.page,
          size: data.meta.size,
          total: data.meta.total,
          totalPage: data.meta.totalPage,
        },
      }));
    }
  }, [data]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };
  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination((prev) => ({
      ...prev,
      size: itemsPerPage,
      page: 1,
    }));
  };

  const [deleteOrder] = useDeleteOrderMutation();

  const handleRowSelect = (order: any) => {
    setSelectedRows((prev) =>
      prev.some((selectedOrder) => selectedOrder.id === order.id)
        ? prev.filter((selectedOrder) => selectedOrder.id !== order.id)
        : [...prev, order]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data?.data?.length) {
      // Deselect all if all rows are selected
      setSelectedRows([]);
    } else {
      // Select all rows (store full order objects in selectedRows)
      setSelectedRows(data?.data || []);
    }
  };

  const handleDelete = async () => {
    for (const order of selectedRows) {
      await deleteOrder(order.id);
    }
    setSelectedRows([]);
  };

  const handleRowClick = (orderId: number) => {
    navigate(`/kry-admin-portal/admin-order-track/${orderId}`);
  };

  if (isLoading) {
    return <LoaderSpinner />;
  }

  // The new function for trust order.....
  // The new function for trust order.....

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        {/* Header Section */}

        {/* Filters and Search Section */}
        <div className="flex justify-between items-center bg-white px-4 rounded-lg">
          <div className="flex gap-4 items-center my-4">
            {/* Filter Dropdown */}
            {/* <div>
              <Button
                onClick={() => reactToPrintInvoice()}
                disabled={selectedRows.length === 0}
              >
                Print
              </Button>
            </div>
            <div>
              <Button
                variant={"outline"}
                onClick={() => reactToPrintDeliverySlip()}
                disabled={selectedRows.length === 0}
              >
                Delivery Slip
              </Button>
            </div> */}

            {/* Search Input */}
            <div className="relative w-1/3">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded pl-10 pr-3 py-1 text-gray-700 w-60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {user?.role !== "SUPPORT_EXECUTIVE" && (
            <div className="space-x-2 py-5">
              {/* Keep your existing delete button here */}
              <button
                onClick={handleDelete}
                disabled={selectedRows.length === 0}
                className={`flex items-center px-4 py-1 rounded border ${
                  selectedRows.length > 0
                    ? "text-red-500 border-red-500 hover:bg-red-50"
                    : "text-gray-400 border-gray-300 cursor-not-allowed"
                }`}
              >
                <FiTrash2 className="inline-block mr-1" /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Orders Table */}
        {isError ? (
          <p>Error loading data.</p>
        ) : (
          <Table
            headers={headers}
            data={data?.data}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
            renderRow={(row: any, index: number) => {
              const dynamicIndex =
                index + 1 + (pagination.page - 1) * pagination.size;
              const getOrderStatusUser = (status) => {
                const statusTracking = row.OrderTracking.find(
                  (track) => track.orderStatus === status
                );
                return statusTracking && statusTracking.user
                  ? statusTracking.user.name
                  : "N/A";
              };
              return (
                <>
                  <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                  <td
                    onClick={() => handleRowClick(row.id)}
                    className="px-4 py-2 text-blue-500 font-medium cursor-pointer"
                  >
                    # {row.orderId}
                  </td>
                  <td className="px-1 py-2">
                    <div>{new Date(row.createdAt).toLocaleDateString()}</div>
                    <div>
                      {new Date(row.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </td>

                  <td className="px-4 py-2">
                    {row?.executive?.name || "User"}
                  </td>

                  <td className="px-4 py-2">
                    {row.OrderShippingInfo[0]?.name}
                  </td>
                  <td className="px-4 py-2">
                    {row.OrderShippingInfo[0]?.phone?.replace(/^(\+88)/, "") ||
                      "N/A"}
                  </td>

                  <td className="px-4 py-2">
                    {getOrderStatusUser("PENDING") !== "N/A"
                      ? getOrderStatusUser("PENDING")
                      : getOrderStatusUser("CONFIRMED") !== "N/A"
                      ? getOrderStatusUser("CONFIRMED")
                      : getOrderStatusUser("CANCELLED") !== "N/A"
                      ? getOrderStatusUser("CANCELLED")
                      : getOrderStatusUser("HOLD") !== "N/A"
                      ? getOrderStatusUser("HOLD")
                      : getOrderStatusUser("PROCESSING") !== "N/A"
                      ? getOrderStatusUser("PROCESSING")
                      : getOrderStatusUser("IN_DELIVERY") !== "N/A"
                      ? getOrderStatusUser("IN_DELIVERY")
                      : getOrderStatusUser("DELIVERED") !== "N/A"
                      ? getOrderStatusUser("DELIVERED")
                      : getOrderStatusUser("COMPLETED") !== "N/A"
                      ? getOrderStatusUser("COMPLETED")
                      : "N/A"}
                  </td>

                  <td className="w-36 px-2">
                    <p
                      className={`px-2 py-1 w-full rounded text-xs ${
                        row?.paymentStatus === false && row?.paymentAmount > 0
                          ? "bg-blue-600 text-white"
                          : row?.paymentStatus === false &&
                            row?.paymentAmount === 0
                          ? "bg-red-600 text-white"
                          : "bg-green-700 text-white"
                      }`}
                    >
                      {row?.paymentStatus === false && row?.paymentAmount > 0
                        ? "Partial"
                        : row?.paymentStatus === false &&
                          row?.paymentAmount === 0
                        ? "Unpaid"
                        : "Paid"}
                      {/* {row.paymentStatus ? "Paid" : "Unpaid"} */}
                    </p>
                  </td>

                  <td className="w-32 px-2">
                    <p
                      className={`px-2 w-full py-1 rounded text-xs ${
                        row.orderStatus === "RECEIVED" &&
                        "bg-purple-100 text-purple-700"
                      } ${
                        row.orderStatus === "PENDING" &&
                        "bg-yellow-500 text-white"
                      } ${
                        row.orderStatus === "CONFIRMED" &&
                        "bg-green-600 text-white"
                      } ${
                        row.orderStatus === "CANCELLED" &&
                        "bg-red-600 text-white"
                      } ${
                        row.orderStatus === "DELIVERED" &&
                        "bg-blue-600 text-white"
                      } ${
                        row.orderStatus === "IN_DELIVERY" &&
                        "bg-[#FF4FE2] text-white"
                      } ${
                        row.orderStatus === "SHIPPED" &&
                        "bg-purple-700 text-white"
                      } ${
                        row.orderStatus === "PROCESSING" &&
                        "bg-orange-600 text-white"
                      } ${
                        row.orderStatus === "COMPLETED" &&
                        "bg-indigo-600 text-white"
                      }`}
                    >
                      {row.orderStatus}
                    </p>
                  </td>

                  <td className="px-4 py-2">
                    {row?.totalAmount?.toLocaleString()} ৳
                  </td>
                  <td className="px-4 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          onMouseEnter={() => setActionItem(row)}
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="flex flex-col gap-1"
                      >
                        <DropdownMenuLabel>Order Actions</DropdownMenuLabel>

                        <Button
                          onClick={() => setModalOpen(true)}
                          variant="secondary"
                          className="w-full flex justify-start p-1"
                          size="xs"
                        >
                          Change Status
                        </Button>

                        <Button
                          onClick={() => handleRowClick(row.id)}
                          variant="secondary"
                          className="w-full flex justify-start p-1"
                          size="xs"
                        >
                          Details
                        </Button>

                        <Button
                          onClick={() => reactToPrintInvoice()}
                          variant="secondary"
                          className="w-full flex justify-start p-1"
                          size="xs"
                        >
                          Print Invoice
                        </Button>

                        <div className="invisible hidden -left-full">
                          {row && (
                            <OrderInvoicePrintSingle
                              ref={invoiceRef}
                              orderData={row}
                            />
                          )}
                        </div>

                        <PDFDownloadLink
                          document={<PDFInvoice data={row} />}
                          fileName={`order_${new Date()
                            .toISOString()
                            .slice(0, 10)}.pdf`}
                        >
                          {({ url, loading, error }) => (
                            <div>
                              {loading && (
                                <span>
                                  <ButtonLoader />
                                </span>
                              )}
                              {error && <span>Error: {error.message}</span>}
                              {url && (
                                <Button
                                  variant="secondary"
                                  className="w-full flex justify-start p-1"
                                  size="xs"
                                >
                                  PDF Download
                                </Button>
                              )}
                            </div>
                          )}
                        </PDFDownloadLink>

                        {/* 
                            <li>
                              <Button
                                onClick={() => handleTrustOrder(row)}
                                variant="secondary"
                                className="w-full flex justify-start p-1"
                                size="xs"
                              >
                                Trust Order
                              </Button>
                            </li> */}

                        {row.orderStatus === "PENDING" && (
                          <>
                            <Link to={`/kry-admin-portal/edit-order/${row?.id}`}>
                              <Button
                                variant="secondary"
                                className="w-full flex justify-start p-1"
                                size="xs"
                              >
                                Edit Order
                              </Button>
                            </Link>
                          </>
                        )}

                        {/* <li>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    className="w-full flex justify-start p-1"
                                    size="xs"
                                  >
                                    Return Product
                                  </Button>
                                </DialogTrigger>
                                
                                <DialogContent className="sm:max-w-[700px] max-h-[90%] overflow-y-auto">
                                 
                                  <CreateReturnOrder actionItem={actionItem} />
                                </DialogContent>
                              </Dialog>
                            </li> */}

                        {/* <li>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full p-1 flex justify-start"
                                    size="xs"
                                  >
                                    Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[1000px]">
                                  <OrderDetails actionItem={actionItem}/>
                                </DialogContent>
                              </Dialog>
                            </li> */}
                        <>
                          {/* <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This finance will be delete permanently. Are you sure you
                      want to delete the finance?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="btn-destructive-fill">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteFinanceHandler(finance?.id)}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog> */}
                        </>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </>
              );
            }}
          />
        )}

        <ChangeStatus
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          actionItem={actionItem}
        />
        {/* Pagination Controls */}
        <div className="my-10">
          <OrderPagination
            totalPages={pagination.meta.totalPage || 1}
            currentPage={pagination.page}
            itemsPerPage={pagination.size}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default OrderList;
