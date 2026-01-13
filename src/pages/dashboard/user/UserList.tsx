import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "@/components/store/api/user/userApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Table from "@/components/ui/table";
import { AlertCircle, Eye, EyeOff, MoreHorizontal, Plus } from "lucide-react";
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
import { useChangeUserPasswordByAdminMutation } from "@/components/store/api/authenticationApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const headers = [
  "SERIAL",
  "Name",
  "Role",
  "Email",
  "Contact No",
  "Status",
  "Action",
];

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [, setActionItem] = useState(null);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changePassword, { isLoading: isChangingPassword }] =
    useChangeUserPasswordByAdminMutation();

  // console.log(actionItem);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  // Fetch users dynamically
  const { data, isLoading, isError, refetch } = useGetUsersQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });
  const [deleteUser, { isLoading: deleteLoading, error: deleteError }] =
    useDeleteUserMutation();
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
        title: "User deleted successfully",
        description: "The user has been deleted.",
      });
      refetch(); // Refresh the size list
    } catch (err) {
      console.error("Error deleting ram:", err);
    }
  };

  const handleChangePasswordSubmit = async () => {
    if (!selectedUserId) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please enter the same password in both fields.",
      });
      return;
    }

    try {
      await changePassword({
        userId: selectedUserId,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      }).unwrap();

      toast({
        title: "Password Changed",
        description: "User password changed successfully.",
      });

      setOpenPasswordModal(false);
      setPasswordData({ newPassword: "", confirmPassword: "" });
      setSelectedUserId(null);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to change password",
        description: err?.data?.message || "Something went wrong.",
      });
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
            <Link to={"/kry-admin-portal/add-list-user"}>
              <Button>
                <Plus />
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
                      src={row.avatar}
                      alt={row.name}
                      className="w-8 h-8 rounded-full"
                    />
                    {row.name}
                  </td>
                  <td className="px-4 py-2">{row.role}</td>
                  <td className="px-4 py-2">{row.email || "N/A"}</td>
                  
                  <td className="px-4 py-2">{row.contactNo}</td>
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
                          <Link to={`/kry-admin-portal/update-user/${row.id}`}>
                            <Button
                              className="w-full flex justify-start p-1"
                              variant={"outline"}
                              size="xs"
                            >
                              Edit User
                            </Button>
                          </Link>
                        </>
                        <>
                          <Link to={`/kry-admin-portal/activity-log-user/${row.id}`}>
                            <Button
                              className="w-full flex justify-start p-1"
                              variant={"outline"}
                              size="xs"
                            >
                              Activity Log
                            </Button>
                          </Link>
                        </>
                        <>
                          <button
                            onClick={() => {
                              setSelectedUserId(row.id);
                              setOpenPasswordModal(true);
                            }}
                            className="w-full text-left"
                          >
                            <Button
                              className="w-full flex justify-start p-1"
                              variant={"outline"}
                              size="xs"
                            >
                              Change Password
                            </Button>
                          </button>
                        </>

                        <Dialog
                          open={openPasswordModal}
                          onOpenChange={setOpenPasswordModal}
                        >
                          <DialogContent className="max-w-md">
                            <h2 className="text-lg font-semibold mb-4">
                              Change Password
                            </h2>

                            <div className="space-y-4">
                              {/* New Password Input with Eye Toggle */}
                              <div className="relative">
                                <label className="block text-sm font-medium mb-1">
                                  New Password
                                </label>
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="New Password"
                                  value={passwordData.newPassword}
                                  onChange={(e) =>
                                    setPasswordData({
                                      ...passwordData,
                                      newPassword: e.target.value,
                                    })
                                  }
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowNewPassword((prev) => !prev)
                                  }
                                  className="absolute right-3 top-9 text-gray-500"
                                >
                                  {showNewPassword ? (
                                    <Eye size={18} />
                                  ) : (
                                    <EyeOff size={18} />
                                  )}
                                </button>
                              </div>

                              {/* Confirm Password Input with Eye Toggle */}
                              <div className="relative">
                                <label className="block text-sm font-medium mb-1">
                                  Confirm Password
                                </label>
                                <input
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Confirm Password"
                                  value={passwordData.confirmPassword}
                                  onChange={(e) =>
                                    setPasswordData({
                                      ...passwordData,
                                      confirmPassword: e.target.value,
                                    })
                                  }
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowConfirmPassword((prev) => !prev)
                                  }
                                  className="absolute right-3 top-9  text-gray-500"
                                >
                                  {showConfirmPassword ? (
                                    <Eye size={18} />
                                  ) : (
                                    <EyeOff size={18} />
                                  )}
                                </button>
                              </div>

                              <Button
                                onClick={handleChangePasswordSubmit}
                                disabled={isChangingPassword}
                                className="w-full"
                              >
                                {isChangingPassword ? (
                                  <ButtonLoader />
                                ) : (
                                  "Change Password"
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                disabled
                                variant="secondary"
                                className="w-full flex justify-start p-1"
                                size="xs"
                              >
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[1000px]">
                              {/* <UserDetails actionItem={actionItem} /> */}
                            </DialogContent>
                          </Dialog>
                        </>
                        <>
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
                        </>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default UserList;
