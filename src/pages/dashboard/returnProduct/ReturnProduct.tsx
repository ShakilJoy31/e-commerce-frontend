import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  useDeleteReturnOrderMutation,
  useGetReturnOrdersQuery,
  useUpdateReturnOrderStatusMutation,
} from "@/components/store/api/returnproduct/returnproductApi";
import { Button } from "@/components/ui/button";
import Table from "@/components/ui/table";
import { useEffect, useState } from "react";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import UpdateReturn from "./UpdateReturn";
import Pagination from "@/components/ui/pagination";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const headers = [
  "Sl",
  "Order ID",
  "Date",
  "Customer",
  "Reason",
  "Status",
  "Total",
  "Action",
];

const ReturnProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [actionItem, setActionItem] = useState(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    sort: "asc",
    page: 1,
    size: 10,
    meta: {
      page: null,
      size: null,
      total: null,
      totalPage: null,
    },
  });

  // Fetch return orders dynamically
  const { data, isLoading, isError } = useGetReturnOrdersQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });

  const [updateOrder] = useUpdateReturnOrderStatusMutation();
  const [deleteReturn] = useDeleteReturnOrderMutation();

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

  const handleBulkDelete = async () => {
    try {
      for (const order of selectedRows) {
        await deleteReturn(order.id);
      }
      toast({
        title: "Delete Return Message",
        description: toastMessageGenerator("delete", "return"),
      });
      setSelectedRows([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteReturn(id);
      if (result?.data?.success) {
        toast({
          title: "Delete Return Message",
          description: toastMessageGenerator("delete", "return"),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Navigate to return order details
  const handleRowClick = (orderId: number) => {
    navigate(`/kry-admin-portal/admin-order-return-track/${orderId}`);
  };

  if (isLoading) {
    return <LoaderSpinner />;
  }

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Return Orders</h1>
        </div>

        {/* Filters and Search Section */}
        <div className="flex justify-between items-center bg-white px-4 rounded-lg py-3">
          {/* Search Input */}
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search by Order ID..."
              className="border rounded pl-10 pr-3 py-1 text-gray-700 w-60"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div>
            {/* Bulk delete button */}
            <button
              onClick={handleBulkDelete}
              disabled={selectedRows.length === 0}
              className={`px-4 py-1 rounded border ${
                selectedRows.length > 0
                  ? "text-red-500 border-red-500 hover:bg-red-50"
                  : "text-gray-400 border-gray-300 cursor-not-allowed"
              }`}
            >
              <FiTrash2 className="inline-block mr-1" /> Delete Selected
            </button>
          </div>
        </div>

        {/* Return Orders Table */}
        {isError ? (
          <p>Error loading data.</p>
        ) : (
          <Table
            headers={headers}
            data={data?.data}
            renderRow={(row: any, index: number) => {
              const dynamicIndex =
                index + 1 + (pagination.page - 1) * pagination.size;

              return (
                <>
                  <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                  {/* Order ID */}
                  <td
                    onClick={() => handleRowClick(row.id)}
                    className="px-4 py-2 text-blue-500 font-medium cursor-pointer"
                  >
                    {row.order?.orderId}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-2">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-2">
                    {row.order?.user?.name || "N/A"}
                  </td>

                  {/* Return Reason */}
                  <td className="px-4 py-2">{row.reason.replace("_", " ")}</td>

                  {/* Return Status */}
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        row.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : row.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>

                  {/* Total Amount */}
                  <td className="px-4 py-2">
                    {row.totalAmount.toLocaleString()} ৳
                  </td>

                  <td className="px-4 py-2">
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

                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="secondary"
                                  className="w-full flex justify-start p-1"
                                  size="xs"
                                >
                                  Update Return
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[700px] max-h-[90%] overflow-y-auto">
                                <UpdateReturn actionItem={actionItem} />
                              </DialogContent>
                            </Dialog>
                          </>

                          <>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="secondary"
                                  className="w-full flex justify-start p-1"
                                  size="xs"
                                >
                                  Approve
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure you want to approve this
                                    return?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will update the return status to
                                    APPROVED.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      updateOrder({
                                        id: row?.id,
                                        data: { status: "APPROVED" },
                                      })
                                    }
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Confirm Approve
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>

                          <>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="secondary"
                                  className="w-full flex justify-start p-1"
                                  size="xs"
                                >
                                  Reject
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure you want to reject this return?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will update the return status to
                                    REJECTED.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      updateOrder({
                                        id: row?.id,
                                        data: { status: "REJECTED" },
                                      })
                                    }
                                  >
                                    Confirm Reject
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>

                          <>
                            <Button
                              variant="secondary"
                              onClick={() => handleRowClick(row.id)}
                              className="w-full flex justify-start p-1"
                              size="xs"
                            >
                              Details
                            </Button>
                          </>

                          <>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  className="w-full flex justify-start p-1"
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
                                    This finance will be delete permanently. Are
                                    you sure you want to delete the finance?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="btn-destructive-fill">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(row?.id)}
                                  >
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </td>
                </>
              );
            }}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
          />
        )}

        {/* Pagination Controls */}
        <div className="my-10">
          <Pagination
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

export default ReturnProduct;
