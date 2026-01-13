import PageWrapper from "@/components/common/wrapper/PageWrapper";
import Table from "@/components/ui/table";
import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useGetCustomersQuery } from "@/components/store/api/user/userApi";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import Pagination from "@/components/ui/pagination";
import ChangeStatus from "../order/ChangeStatus";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CustomerInfo from "./CustomerInfo";

const Customer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [actionItem, setActionItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const { data, isLoading, isError } = useGetCustomersQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });
  const customers = data?.data || [];

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

  if (isLoading) {
    return <LoaderSpinner />;
  }

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Customers</h1>
        </div>

        {/* Search */}
        <div className="flex justify-between items-center bg-white px-4 py-3 rounded-lg">
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded pl-10 pr-3 py-2 text-gray-700 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Loading & Error Handling */}
        {isLoading && <LoaderSpinner />}
        {isError && (
          <p className="text-red-500 text-center">Failed to fetch customers</p>
        )}

        {/* Customer Table */}
        {!isLoading && !isError && (
          <Table
          
            headers={[
              "S/L",
              "Name",
              "Mobile Number",
              "Orders",
              "Pending",
              "Confirmed",
              "Cancelled",
              "Completed",
              "Delivered",
              "Spent",
            ]}
            data={customers}
            renderRow={(customer, index: number) => {
              const dynamicIndex =
                index + 1 + (pagination.page - 1) * pagination.size;

              return (
                <>
                  <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                  <td
                    onMouseEnter={() => setActionItem(customer)}
                    className="px-4 py-2 flex items-center gap-2"
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full p-1 border-none hover:bg-none flex justify-start"
                          size="default"
                        >
                          <img
                            src={customer.avatar}
                            alt={customer.name}
                            className="w-8 h-8 rounded-full"
                          />
                          {customer.name}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[1000px]">
                        <CustomerInfo actionItem={actionItem} />
                      </DialogContent>
                    </Dialog>
                  </td>
                  <td className="px-4 py-2">{customer.contactNo}</td>
                  {/* <td className="px-4 py-2">{customer.address}</td> */}
                  <td className="px-4 py-2">{customer.Order.length}</td>
                  <td className="px-4 py-2">
                    {
                      customer.Order.filter(
                        (order) => order.orderStatus === "PENDING"
                      ).length
                    }
                  </td>
                  <td className="px-4 py-2">
                    {
                      customer.Order.filter(
                        (order) => order.orderStatus === "CANCELLED"
                      ).length
                    }
                  </td>
                  <td className="px-4 py-2">
                    {
                      customer.Order.filter(
                        (order) => order.orderStatus === "CONFIRMED"
                      ).length
                    }
                  </td>
                  <td className="px-4 py-2">
                    {
                      customer.Order.filter(
                        (order) => order.orderStatus === "COMPLETED"
                      ).length
                    }
                  </td>
                  <td className="px-4 py-2">
                    {
                      customer.Order.filter(
                        (order) => order.orderStatus === "DELIVERED"
                      ).length
                    }
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    {customer.Order.reduce(
                      (sum, order) => sum + order.totalAmount,
                      0
                    )}{" "}
                    ৳
                  </td>
                </>
              );
            }}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
          />
        )}

        <ChangeStatus
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          actionItem={actionItem}
        />
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

export default Customer;
