import PageWrapper from "@/components/common/wrapper/PageWrapper";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { useGetAllPreOrdersQuery } from "@/components/store/api/preOrder/preorderApi";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
//   DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OrderPagination from "@/components/ui/OrderPagination";
import Table from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

const headers = [
  "SL",
  "Product Name",
  "Customer Name",
  "Phone",
  "Email",
  "Address",
  "Date",
  "Action"
];

const PreOrderFormList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

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
  } = useGetAllPreOrdersQuery({
    page: pagination.page,
    size: pagination.size,
    search: searchTerm || undefined,
    sortOrder: pagination.sort,
  });

  useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        meta: {
          page: data.meta?.page || 1,
          size: data.meta?.size || 10,
          total: data.meta?.total || 0,
          totalPage: data.meta?.totalPage || 1,
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

  const handleRowSelect = (preorder: any) => {
    setSelectedRows((prev) =>
      prev.some((selected) => selected.id === preorder.id)
        ? prev.filter((selected) => selected.id !== preorder.id)
        : [...prev, preorder]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data?.data?.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data?.data || []);
    }
  };

//   const handleAcceptPreOrder = async (id: number) => {
//     try {
//       // Implement your accept pre-order logic here
//       toast.success("Pre-order accepted successfully");
//       refetch();
//     } catch (error) {
//       console.error("Error accepting pre-order:", error);
//       toast.error("Failed to accept pre-order");
//     }
//   };

  if (preorderLoading) {
    return <LoaderSpinner />;
  }

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        {/* Filters and Search Section */}
        <div className="flex justify-between items-center bg-white px-4 rounded-lg">
          <div className="flex gap-4 items-center my-4">
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

        {/* Pre-Orders Table */}
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
                  <td className="px-4 py-2">{row.productName || "N/A"}</td>
                  <td className="px-4 py-2">{row.name || "N/A"}</td>
                  <td className="px-4 py-2">{row.phone || "N/A"}</td>
                  <td className="px-4 py-2">{row.email || "N/A"}</td>
                  <td className="px-4 py-2">{row.address || "N/A"}</td>
                  <td className="px-4 py-2">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
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
                        {/* <DropdownMenuLabel>Pre-Order Actions</DropdownMenuLabel>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="default"
                              className="w-full px-2 py-1 flex justify-start"
                              size="xs"
                            >
                              Accept Pre-Order
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will convert the pre-order to a regular order.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="btn-destructive-fill">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleAcceptPreOrder(row?.id)}
                              >
                                Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </>
              );
            }}
          />
        )}

        {/* Pagination Controls */}
        {data?.meta && (
          <div className="my-10">
            <OrderPagination
              totalPages={pagination.meta.totalPage || 1}
              currentPage={pagination.page}
              itemsPerPage={pagination.size}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default PreOrderFormList;