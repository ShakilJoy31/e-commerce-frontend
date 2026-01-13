import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  useGetCustomersQuery,
  useUpdateUserMutation,
} from "@/components/store/api/user/userApi";
import { Button } from "@/components/ui/button";
import Table from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import Pagination from "@/components/ui/pagination";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { toast } from "@/components/ui/use-toast";
import { FaRegEdit, FaStar } from "react-icons/fa";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EditCustomer from "./EditCustomer";

interface User {
  id: number;
  name: string;
  email: string;
  contactNo: string;
  point: number;
  withdrawPoint: number;
  active: boolean;
  avatar?: string;
  starMark: number;
  createdAt:string;
}

const headers = [
  "SERIAL",
  "Star Mark",
  "Name",
  "Email",
  "Created At",
  "Contact No",
  "Point",
  "Withdraw Point",
  "Active",
  "Edit",
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  const [updateUser] = useUpdateUserMutation();
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<{
    type: "sort" | "sortBy" | "orderCount" | "orderAmount";
    value: string;
  }>({ type: "sort", value: "desc" });
  const [pagination, setPagination] = useState({
    sort: "asc",
    page: 1,
    size: 20,
    meta: {
      page: null,
      size: null,
      total: null,
      totalPage: null,
    },
  });

  // Fetch users dynamically
  const { data, isLoading, isError, refetch } = useGetCustomersQuery({
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
    sort: filter.type === "sort" ? filter.value : "",
    sortBy: filter.type === "sortBy" ? filter.value : "createdAt",
    orderCount: filter.type === "orderCount" ? filter.value : "",
    orderAmount: filter.type === "orderAmount" ? filter.value : "",
  });

  // Initialize localUsers when data is fetched
  useEffect(() => {
    if (data?.data) {
      // Use the active status from API response if available, default to true if not provided
      const usersWithStatus = data.data.map((user: any) => ({
        ...user,
        active: user.active !== undefined ? user.active : true,
      }));
      setLocalUsers(usersWithStatus);
    }
  }, [data]);

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

  const handleRowSelect = (user: User) => {
    setSelectedRows((prev) =>
      prev.some((selectedUser) => selectedUser.id === user.id)
        ? prev.filter((selectedUser) => selectedUser.id !== user.id)
        : [...prev, user]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === localUsers?.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(localUsers || []);
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleEditClick = (id: number) => {
    setSelectedId(id);
  };

  const handleToggleActive = async (userId: number) => {
    try {
      // Find the current user
      const userIndex = localUsers.findIndex((user) => user.id === userId);
      if (userIndex === -1) return;

      const currentUser = localUsers[userIndex];
      const newStatus = !currentUser.active;

      // Optimistic update
      setLocalUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, active: newStatus } : user
        )
      );

      // API call
      const updateResult = await updateUser({
        id: userId,
        data: { active: newStatus },
      }).unwrap();

      if (updateResult.success) {
        toast({
          title: "Success!",
          description: updateResult.message,
        });
        // Refetch data to ensure we have the latest state from the server
        refetch();
      } else {
        // Revert if API call fails
        setLocalUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, active: currentUser.active } : user
          )
        );
        toast({
          title: "Error",
          description: updateResult.message || "Failed to update user status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white px-4 py-3 rounded-lg shadow-sm gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Dropdown */}
            <div className="w-full sm:w-auto">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                onChange={(e) => {
                  const [type, value] = e.target.value.split(":");
                  setFilter({ type: type as any, value });
                }}
                value={`${filter.type}:${filter.value}`}
              >
                {/* Date sorting - New/Old makes sense here */}
                <optgroup label="Date">
                  <option value="sort:desc">Newest First</option>
                  <option value="sort:asc">Oldest First</option>
                </optgroup>

                {/* Star mark sorting - High/Low makes more sense */}
                <optgroup label="Star Rating">
                  <option value="sortBy:starMark">Highest Rated</option>
                  <option value="sortBy:createdAt">Lowest Rated</option>
                </optgroup>

                {/* Order count filtering - More/Less makes sense */}
                <optgroup label="Order Count">
                  <option value="orderCount:min_gt_max">More Orders</option>
                  <option value="orderCount:max_lt_min">Fewer Orders</option>
                </optgroup>

                {/* Order amount filtering - Higher/Lower makes sense */}
                <optgroup label="Order Amount">
                  <option value="orderAmount:min_gt_max">Higher Amounts</option>
                  <option value="orderAmount:max_lt_min">Lower Amounts</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-x-2 py-5">
            <Link to={"/kry-admin-portal/add-customers-user"}>
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
            data={localUsers}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
            renderRow={(row: User, index: number) => {
              const dynamicIndex =
                index + 1 + (pagination.page - 1) * pagination.size;
              return (
                <>
                  <td className="px-4 text-center py-2 font-medium">
                    {dynamicIndex}
                  </td>
                  <td className="px-4 text-center py-2 font-medium">
                    <div className="flex text-center justify-center items-center gap-2">
                      {/* Star rating */}
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Number(row.starMark)
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 flex items-center gap-2 py-2 text-blue-500 font-medium cursor-pointer">
                    <img
                      src={row.avatar}
                      alt={row.name}
                      className="w-8 h-8 rounded-full"
                    />
                    {row.name}
                  </td>
                  <td className="px-4 py-2">{row.email || "N/A"}</td>
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
                  <td className="px-4 py-2">{row.contactNo}</td>
                  <td className="px-4 py-2">{row.point}</td>
                  <td className="px-4 py-2">{row.withdrawPoint}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center">
                      <button
                        type="button"
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          row.active ? "bg-blue-600" : "bg-gray-200"
                        }`}
                        onClick={() => handleToggleActive(row.id)}
                        aria-pressed={row.active}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            row.active ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                  <td>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => handleEditClick(row.id)}
                          variant="outline"
                          className=""
                          size={"sm"}
                        >
                          <FaRegEdit size={25} className="text-green-500" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[1000px] max-h-[70vh] overflow-y-auto">
                        {selectedId && (
                          <EditCustomer
                            id={selectedId}
                            setIsDialogOpen={setIsDialogOpen}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </td>
                </>
              );
            }}
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

export default Customers;
