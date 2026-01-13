import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Table from "@/components/ui/table";
import { AlertCircle, MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
// import UserDetails from "./UserDetails";
import Pagination from "@/components/ui/pagination";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { useToast } from "@/components/ui/use-toast";
import {
  useDeletePopupMutation,
  useGetPopupsQuery,
} from "@/components/store/api/popupList/popupApi";
import EditPopup from "./EditPopup";

const headers = ["SL", "Image", "Status", "Action"];

const PopupList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [actionItem, setActionItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const { toast } = useToast();
  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

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

  const all = "all";
  // Fetch users dynamically
  const { data, isLoading, isError, refetch } = useGetPopupsQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
    status: all,
  });
  const [deleteUser, { isLoading: deleteLoading, error: deleteError }] =
    useDeletePopupMutation();
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

  const handleRowSelect = (user: any) => {
    setSelectedRows((prev) =>
      prev.some((selectedUser) => selectedUser.id === user.id)
        ? prev.filter((selectedUser) => selectedUser.id !== user.id)
        : [...prev, user]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data?.data?.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data?.data || []);
    }
  };

  const handleDelete = async () => {
    for (const user of selectedRows) {
      await deleteUser(user.id);
    }
    setSelectedRows([]);
  };

  const handleRowClick = (userId: number) => {
    navigate(`/kry-admin-portal/admin-user-details/${userId}`);
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id).unwrap();
      toast({
        title: "Popup deleted successfully",
        description: "The popup has been deleted.",
      });
      refetch(); // Refresh the size list
    } catch (err) {
      console.error("Error deleting ram:", err);
    }
  };

  if (isLoading) {
    return <LoaderSpinner />;
  }

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-white px-4 rounded-lg">
          {/* Filters and Search Section */}
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

          {/* Action Buttons */}
          <div className="space-x-2 py-5">
            <button
              onClick={handleDelete}
              disabled={selectedRows.length === 0}
              className={`px-4 py-1.5 -mt-1 rounded border ${
                selectedRows.length > 0
                  ? "text-red-500 border-red-500 hover:bg-red-50"
                  : "text-gray-400 border-gray-300 cursor-not-allowed"
              }`}
            >
              <FiTrash2 className="inline-block mr-1" /> Delete
            </button>
            <Link to={"/kry-admin-portal/add-popup"}>
              <Button size={"sm"}>
                <Plus /> Add Popup
              </Button>
            </Link>
          </div>
        </div>

        {/* Users Table */}
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
                    className="px-4 flex items-center gap-2 py-2 text-blue-500 font-medium cursor-pointer"
                  >
                    <img
                      src={row.image}
                      alt={"popup"}
                      className="w-40 mx-auto h-20 object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        row.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="relative inline-block">
                      <button
                        onClick={() => toggleDropdown(row.id)}
                        onMouseEnter={() => setActionItem(row)}
                        className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {openDropdown === row.id && (
                        <ul
                          className="dropdown-menu absolute right-0 border border-primary p-2 space-y-2 text-gray-700 bg-white shadow-lg rounded-md w-32 mt-1 z-50"
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <li>
                           
                            <Dialog
                              open={openModal}
                              onOpenChange={setOpenModal}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="default"
                                  className="flex w-full p-1 justify-start"
                                  size="xs"
                                  onMouseEnter={() => setActionItem(row)}
                                >
                                  Edit Popup
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[1000px]">
                                {/* ADD NEW PRODUCT FORM CONTAINER */}
                                <EditPopup
                                  setModalOpen={setOpenModal}
                                  actionItem={actionItem}
                                />
                              </DialogContent>
                            </Dialog>
                          </li>
                          
                          <li>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
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
                                    Are you sure you want to delete?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="btn-destructive-fill">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(row.id)}
                                  >
                                    {deleteLoading && <ButtonLoader />} Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </li>
                        </ul>
                      )}
                    </div>
                  </td>
                </>
              );
            }}
          />
        )}

        {deleteError && "data" in deleteError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>User Error</AlertTitle>
            <AlertDescription>
              {(deleteError.data as { message?: string })?.message ||
                "Something went wrong! Please try again."}
            </AlertDescription>
          </Alert>
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

export default PopupList;
