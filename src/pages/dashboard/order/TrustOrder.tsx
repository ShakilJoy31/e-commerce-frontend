import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  useDeleteOrderMutation,
  useGetTrustOrdersQuery,
} from "@/components/store/api/order/orderApi";
import Table from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import OrderInvoicePrint from "./OrderInvoicePrint";
import DeliverySlipPrint from "./DeliverySlipPrint";
import OrderPagination from "@/components/ui/OrderPagination";
import { useSelector } from "react-redux";
import { selectUser } from "@/components/store/store";

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
];

const TrustOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
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

  // Fetch trust orders
  const { data, isLoading, isError } = useGetTrustOrdersQuery({
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
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

  const invoiceRef = useRef<HTMLDivElement>(null);
  const deliverySlipRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return <LoaderSpinner />;
  }

  const getOrderStatusUser = (status: string, orderTracking: any[]) => {
    const statusTracking = orderTracking.find(
      (track) => track.orderStatus === status
    );
    return statusTracking && statusTracking.user
      ? statusTracking.user.name
      : "N/A";
  };

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        {/* Filters and Search Section */}
        <div className="flex justify-between items-center bg-white px-4 rounded-lg">
          <div className="flex gap-4 items-center my-4">
            {/* Filter Dropdown */}

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
                    {getOrderStatusUser("PENDING", row.OrderTracking) !== "N/A"
                      ? getOrderStatusUser("PENDING", row.OrderTracking)
                      : getOrderStatusUser("CONFIRMED", row.OrderTracking) !==
                        "N/A"
                      ? getOrderStatusUser("CONFIRMED", row.OrderTracking)
                      : getOrderStatusUser("CANCELLED", row.OrderTracking) !==
                        "N/A"
                      ? getOrderStatusUser("CANCELLED", row.OrderTracking)
                      : getOrderStatusUser("HOLD", row.OrderTracking) !== "N/A"
                      ? getOrderStatusUser("HOLD", row.OrderTracking)
                      : getOrderStatusUser("PROCESSING", row.OrderTracking) !==
                        "N/A"
                      ? getOrderStatusUser("PROCESSING", row.OrderTracking)
                      : getOrderStatusUser("IN_DELIVERY", row.OrderTracking) !==
                        "N/A"
                      ? getOrderStatusUser("IN_DELIVERY", row.OrderTracking)
                      : getOrderStatusUser("DELIVERED", row.OrderTracking) !==
                        "N/A"
                      ? getOrderStatusUser("DELIVERED", row.OrderTracking)
                      : getOrderStatusUser("COMPLETED", row.OrderTracking) !==
                        "N/A"
                      ? getOrderStatusUser("COMPLETED", row.OrderTracking)
                      : "N/A"}
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
                        row.orderStatus === "COMPLETED"
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
                </>
              );
            }}
          />
        )}

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

export default TrustOrder;

// <td className="px-4 py-2">
//                   <>
//                     <div className="relative inline-block">
//                       <button
//                         onClick={() => toggleDropdown(row.id)}
//                         onMouseEnter={() => setActionItem(row)}
//                         className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center"
//                       >
//                         <span className="sr-only">Open menu</span>
//                         <MoreHorizontal className="h-4 w-4" />
//                       </button>

//                       {/* Dropdown Menu */}
//                       {openDropdown === row.id && (
//                         <ul
//                           className="dropdown-menu absolute right-0 border border-primary p-2 space-y-2 text-gray-700  bg-white shadow-lg rounded-md w-32 mt-1 z-50"
//                           onMouseLeave={() => setOpenDropdown(null)}
//                         >
//                           <li>
//                             <Button
//                               onClick={() => setModalOpen(true)}
//                               variant="secondary"
//                               className="w-full flex justify-start p-1"
//                               size="xs"
//                             >
//                               Change Status
//                             </Button>
//                           </li>

//                           {row.orderStatus === "PENDING" && (
//                             <li>
//                               <Link to={`/kry-admin-portal/edit-order/${row?.id}`}>
//                                 <Button
//                                   variant="secondary"
//                                   className="w-full flex justify-start p-1"
//                                   size="xs"
//                                 >
//                                   Edit Order
//                                 </Button>
//                               </Link>
//                             </li>
//                           )}

//                           <li>
//                             <Dialog>
//                               <DialogTrigger asChild>
//                                 <Button
//                                   variant="destructive"
//                                   className="w-full flex justify-start p-1"
//                                   size="xs"
//                                 >
//                                   Return Product
//                                 </Button>
//                               </DialogTrigger>
//                               <DialogContent className="sm:max-w-[700px] max-h-[90%] overflow-y-auto">
//                                 <CreateReturnOrder actionItem={actionItem} />
//                               </DialogContent>
//                             </Dialog>
//                           </li>

//                           <li>
//                             <Dialog>
//                               <DialogTrigger asChild>
//                                 <Button
//                                   variant="outline"
//                                   className="w-full p-1 flex justify-start"
//                                   size="xs"
//                                 >
//                                   Details
//                                 </Button>
//                               </DialogTrigger>
//                               <DialogContent className="sm:max-w-[1000px]">
//                                 <OrderDetails actionItem={actionItem} />
//                               </DialogContent>
//                             </Dialog>
//                           </li>
//                         </ul>
//                       )}
//                     </div>
//                   </>
//                 </td>
