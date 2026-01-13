import PageWrapper from "@/components/common/wrapper/PageWrapper";
import ButtonLoader from "@/components/loader/ButtonLoader";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
  useEditPreOrderMutation,
  useGetPreOrdersQuery,
} from "@/components/store/api/order/orderApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OrderPagination from "@/components/ui/OrderPagination";
import Table from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";
import ChangeStatusPreorder from "./ChangePreOrderStatus";

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

const PreOrderList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [actionItem, setActionItem] = useState(null);
  const [modalOpen, setModalOpen]=useState(false)
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
  const {
    data,
    isLoading: preorderLoading,
    isError,
    refetch,
  } = useGetPreOrdersQuery({
    page: pagination.page,
    size: pagination.size,
    search: searchTerm || undefined,
    sortOrder: pagination.sort,
  });

  const [acceptOrder, { isLoading }] = useEditPreOrderMutation();
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

  const acceptPreOrder = async (id: number) => {
    try {
      const result = await acceptOrder(id).unwrap();

      if (result.success) {
        toast.success("Order accepted successfully");
      }
      refetch();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  if (preorderLoading) {
    return <LoaderSpinner />;
  }
  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        {/* Header Section */}

        {/* Filters and Search Section */}
        <div className="flex justify-between items-center bg-white px-4 rounded-lg">
          <div className="flex gap-4 items-center my-4">
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
                  <td className="px-4 py-2 text-blue-500 font-medium cursor-pointer">
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
                        <DropdownMenuLabel>Pre Order Actions</DropdownMenuLabel>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="default"
                              className="w-full px-2 py-1 flex justify-start"
                              size="xs"
                            >
                              Accept Order
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This pre-order will be added in orderlist if you
                                accept this.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="btn-destructive-fill">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => acceptPreOrder(row?.id)}
                              >
                                {isLoading && <ButtonLoader />}Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <>
                          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="default"
                                className="flex justify-start h-7"
                                size="sm"
                              >
                                Cancel Order
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              {/* ADD NEW PRODUCT FORM CONTAINER */}
                              <ChangeStatusPreorder actionItem={actionItem} isOpen={modalOpen} onClose={setModalOpen}/>
                            </DialogContent>
                          </Dialog>
                        </>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
    </PageWrapper>
  );
};

export default PreOrderList;
