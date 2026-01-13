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
import OrderInvoicePrint from "./OrderInvoicePrint";
import DeliverySlipPrint from "./DeliverySlipPrint";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import OrderInvoicePrintSingle from "./OrderInvoicePrintSingle";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFInvoice from "@/pages/public/myAccount/PDFInvoice";
import ButtonLoader from "@/components/loader/ButtonLoader";
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

const headers = [
  "SL",
  "Order",
  "Date",
  "Name",
  "Phone",
  "Payment Status",
  "Order Status",
  "Total",
  "Action",
];

interface OrderListProps {
  selectedRow: any[];
  setSelectedRow: React.Dispatch<React.SetStateAction<any[]>>;
  filterBy: string;
  categoryId: any;
  from: any;
  to: any;
}
const PendingOrder = ({
  setSelectedRow,
  filterBy,
  categoryId,
  from,
  to,
}: OrderListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [actionItem, setActionItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const reactToPrintInvoice = useReactToPrint({ contentRef: invoiceRef });

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
  const type = "PENDING";
  const { data, isLoading, isError } = useGetOrdersQuery({
    fromDate: toYMD(from),
    toDate: toYMD(to),
    filterBy: filterBy,
    categoryId: categoryId,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
    status: type,
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
    setSelectedRows(
      (prev) =>
        prev.some((selectedOrder) => selectedOrder.id === order.id)
          ? prev.filter((selectedOrder) => selectedOrder.id !== order.id) // Deselect the row
          : [...prev, order] // Select the row by adding the entire order object
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

  const deliverySlipRef = useRef<HTMLDivElement>(null);

  // Create separate print functions for both print options
  // const reactToPrintInvoice = useReactToPrint({ contentRef: invoiceRef });
  // const reactToPrintDeliverySlip = useReactToPrint({
  //   contentRef: deliverySlipRef,
  // });

  if (isLoading) {
    return <LoaderSpinner />;
  }

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        {/* Header Section */}
        {/* <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Orders</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">
              Export
            </button>
            <button className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">
              <Plus className="font-bold w-4 h-4" /> Add Order
            </button>
          </div>
        </div> */}

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

          {/* Action Buttons */}
          {user?.role !== "SUPPORT_EXECUTIVE" && (
            <div className="space-x-2 py-5">
              {/* Keep your existing delete button here */}
              <button
                onClick={handleDelete}
                disabled={selectedRows.length === 0}
                className={`px-4 py-1 rounded border ${
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
              return (
                <>
                  <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                  <td
                    onClick={() => handleRowClick(row.id)}
                    className="px-4 py-2 text-blue-500 font-medium cursor-pointer"
                  >
                    # {row.orderId}
                  </td>
                  <td className="px-2 py-2">
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
                    {row.OrderShippingInfo[0]?.name}
                  </td>
                  <td className="px-4 py-2">
                    {row.OrderShippingInfo[0]?.phone}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        row.paymentStatus
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row.paymentStatus ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        row.orderStatus === "RECEIVED"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {row.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {row?.totalAmount?.toLocaleString()} ৳
                  </td>
                  <td className="px-4 py-2">
                    <>
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
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
      <div className="invisible hidden -left-full">
        {selectedRows.length > 0 && (
          <OrderInvoicePrint ref={invoiceRef} orderData={selectedRows} />
        )}
        {selectedRows.length > 0 && (
          <DeliverySlipPrint ref={deliverySlipRef} orderData={selectedRows} />
        )}
      </div>
    </PageWrapper>
  );
};

export default PendingOrder;
