import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  useGetReturnOrdersByUserQuery,
} from "@/components/store/api/returnproduct/returnproductApi";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import Table from "@/components/ui/table";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
// import { toast } from "@/components/ui/use-toast";
// import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
// import { MoreHorizontal } from "lucide-react";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
import { useSelector } from "react-redux";
import { selectUser } from "@/components/store/store";
import Pagination from "@/components/ui/pagination";
import ReturnOrderModal from "./ReturnOrderModal";
const headers = [
  // "Order ID",
  "SL",
  "Order ID",
  "Date",
  "Customer",
  "Reason",
  "Status",
  "Total",
  // "Action",
];

const ReturnOrderList = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
  // const [actionItem, setActionItem] = useState(null);
  const user = useSelector(selectUser);
  // Fetch return orders dynamically
  const { data, isLoading, isError } = useGetReturnOrdersByUserQuery({
    id: user?.id,
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

//  const navigate = useNavigate();
  console.log("return user", data?.data)

  // const [deleteReturn] = useDeleteReturnOrderMutation();

  // const handleDelete = async (id: number) => {
  //   try {
  //     const result = await deleteReturn(id);

  //     if (result?.data?.success) {
  //       toast({
  //         title: "Delete Return Message",
  //         description: toastMessageGenerator("delete", "return"),
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
      page, // Update the page value
    }));
  };
  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination((prev) => ({
      ...prev,
      size: itemsPerPage,
      page: 1, 
    }));
  };



  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
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
        </div>

        {/* Return Orders Table */}
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
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
                   {/* Id */}
                  <td 
                    onClick={() => setSelectedOrderId(row?.id)}
                  className="px-4 py-2 cursor-pointer text-blue-600">
                    {row?.order?.orderId || "N/A"}
                  </td>
                  {/* Order ID */}
                  {/* <td
                    onClick={() => handleRowClick(row.orderId)}
                    className="px-4 py-2 text-blue-500 font-medium cursor-pointer"
                  >
                    {row.orderId}
                  </td> */}

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

                  {/* <td className="px-4 py-2">
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
                          <DropdownMenuLabel>Orders Actions</DropdownMenuLabel>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="default"
                                className="w-full flex justify-start py-1 px-3"
                                size="xs"
                              >
                                Update Return
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[700px] max-h-[90%] overflow-y-auto">
                            
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                type="button"
                                variant="destructive"
                                className="w-full flex justify-start px-3 py-1"
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  </td> */}
                </>
              );
            }}
            selectedRows={undefined}
            onRowSelect={undefined}
            onSelectAll={undefined}
          />
        )}

        {selectedOrderId && (
  <ReturnOrderModal
    isOpen={true}
    onClose={() => setSelectedOrderId(null)}
    orderId={selectedOrderId}
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

export default ReturnOrderList;
