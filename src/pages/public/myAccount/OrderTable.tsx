import { useGetUserOrderListQuery } from "@/components/store/api/order/orderApi";
import { selectUser } from "@/components/store/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CreateReturnProduct from "./CreateReturnProduct";
import OrderDetailsTable from "./OrderDetailsTable";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { PaginationProps } from "../products/Products";
import { FiCheck, FiCopy } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const [visiblePages, setVisiblePages] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      setVisiblePages(window.innerWidth >= 768 ? 6 : 4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= visiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const end = Math.min(totalPages, start + visiblePages - 1);

    if (end - start + 1 < visiblePages) {
      start = Math.max(1, end - visiblePages + 1);
    }

    const pages: (number | string)[] = [];

    if (start > 1) pages.push(1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      //@ts-ignore
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push("...");

    if (end < totalPages) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 lg:p-1.5 rounded border disabled:opacity-50 text-xs lg:text-base hover:bg-gray-50"
        >
          <IoIosArrowBack className="text-xl"/>
        </button>

        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && onPageChange(page)}
              className={`min-w-[28px] px-0 lg:px-2 py-0 lg:py-1 rounded border text-sm sm:text-base ${
                page === currentPage
                  ? "bg-primary text-white border-primary"
                  : "hover:bg-gray-50"
              } ${
                typeof page !== "number" && "pointer-events-none cursor-default"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 lg:p-1.5 rounded border disabled:opacity-50 text-xs lg:text-base hover:bg-gray-50"
        >
           <IoIosArrowForward className="text-xl"/>
        </button>
      </div>
    </div>
  );
};

const OrderTable: React.FC = () => {
  const user = useSelector(selectUser);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const userId = user?.id;
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const { data, isLoading, isError } = useGetUserOrderListQuery({
    userId,
    page: pagination.page,
    size: pagination.size,
  });

  // Update pagination meta when data changes
  useEffect(() => {
    if (data?.meta) {
      setPagination((prev) => ({
        ...prev,
        meta: data.meta,
      }));
    }
  }, [data?.meta]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({ ...prev, size, page: 1 }));
  };

  const handleDetailsClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailsDialogOpen(true);
  };

  if (!userId)
    return (
      <p className="text-center py-8">Please log in to view your orders.</p>
    );
  if (isLoading)
    return (
      <p className="text-center py-8">
        <LoaderSpinner />
      </p>
    );
  if (isError)
    return <p className="text-center py-8">Error fetching orders.</p>;

  const orderList = data?.data || [];
  const totalPages = data?.meta?.totalPage || 1;

  const orders = orderList?.map((item: any) => ({
    orderId: item?.id,
    id: String(item.orderId),
    date: item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A",
    status: item.orderStatus ?? "N/A",
    total: item.totalAmount ?? 0,
    paymentMethod: item.paymentMethod ?? "N/A",
    partialPaymentMethod: item.partialPaymentMethod ?? "N/A",
    paymentStatus: item.paymentStatus ?? "N/A",
    shippingStatus: item.shippingStatus ?? "N/A",
    products: item.OrderItem.map((product: any) => ({
      name: product?.product?.productName ?? "Unknown Product",
      price: product?.price ?? 0,
      quantity: product?.quantity ?? 0,
    })),
  }));

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id?.toString());
    setCopiedOrderId(id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  return (
    <div className="mx-auto mt-5">
      <div className="bg-white">
        {orders?.map((order) => (
          <div key={order.id} className="p-4 border-b">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base text-primary lg:text-lg font-semibold">
                  Order ID: {order.id}
                </h2>
                <button
                  onClick={() => handleCopy(order.id)}
                  className="flex items-center gap-1 text-sm px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-black transition-colors"
                  aria-label={copiedOrderId === order.id ? "Copied!" : "Copy"}
                >
                  {copiedOrderId === order.id ? (
                    <>
                      <FiCheck className="text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <FiCopy />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <span
                className={`px-3 py-1 rounded-full bg-blue-200 text-xs font-medium ${
                  order.status === "CANCELLED"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <div>{order.status}</div>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Order status:</p>
                <p className="text-sm text-gray-600">Order Date:</p>
                <p className="text-sm text-gray-600">Order Total:</p>
                <p className="text-sm text-gray-600">Payment Method:</p>
                <p className="text-sm text-gray-600">Payment Status:</p>
                <p className="text-sm text-gray-600">Shipping Status:</p>
              </div>

              <div>
                <p className="text-sm font-bold">{order.status}</p>
                <p className="text-sm font-semibold text-gray-600">{order.date}</p>
                <p className="text-sm font-semibold text-gray-600">BDT {order.total.toLocaleString()}</p>
                <p className="text-sm font-semibold text-gray-600">{order.paymentMethod}</p>
                <p className="text-sm font-semibold text-gray-600">
                  {order.paymentStatus ? "Paid" : "Unpaid"}
                </p>
                <p className="text-sm font-semibold text-gray-600">{order.shippingStatus}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Dialog
                open={isDetailsDialogOpen}
                onOpenChange={setIsDetailsDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => handleDetailsClick(order.id)}
                    variant="link"
                    className="text-white bg-primary font-bold border h-7 lg:h-9 px-4 py-1"
                  >
                    Details &gt;&gt;
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95%] lg:max-w-[80vw] max-h-[95vh] overflow-y-auto">
                  {selectedOrderId && (
                    <OrderDetailsTable
                      id={selectedOrderId}
                      setIsDetailsDialogOpen={setIsDetailsDialogOpen}
                    />
                  )}
                </DialogContent>
              </Dialog>

              {["COMPLETED", "DELIVERED", "IN_DELIVERY", "SHIPPED"].includes(
                order?.status || ""
              ) && (
                <Dialog open={openModal} onOpenChange={setOpenModal}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Return Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px] max-h-[90%] overflow-y-auto">
                    <CreateReturnProduct
                      actionItem={order}
                      onSuccess={() => setOpenModal(false)}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="my-5">
        <Pagination
          totalPages={totalPages}
          currentPage={pagination.page}
          pageSize={pagination.size}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default OrderTable;
