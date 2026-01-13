import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import OrderList from "./OrderList";
import {
  useGetOrdersQuery,
  useGetPreOrdersTabQuery,
  useGetTrustOrdersQuery,
  useMoveBulkTrustMutation,
} from "@/components/store/api/order/orderApi";
import ConfirmOrder from "./ConfirmOrder";
import CancellOrder from "./CancellOrder";
import FullfillOrder from "./FullfillOrder";
import FullfillCancellOrder from "./FullfillCancellOrder";
import ShippedOrder from "./ShippedOrder";
import DeliveredOrder from "./DeliveredOrder";
import CompletedOrder from "./CompletedOrder";
import PendingOrder from "./PendingOrder";
import TodayConfirmOrder from "./TodayConfirmOrder";
import TrustOrder from "./TrustOrder";
import { useEffect, useRef, useState } from "react";
import Shipped from "./Shipped";
import toast from "react-hot-toast";
import { useReactToPrint } from "react-to-print";
import OrderInvoicePrint from "./OrderInvoicePrint";
import DeliverySlipPrint from "./DeliverySlipPrint";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MultiOrderPDF from "./MultiOrderPdf";
import UpdateBulkOrderStatus from "./UpdateBulkOrderStatus";
import OrderExcel from "./OrderExcel";
import { CalendarIcon, Plus } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { useGetAllCategoryQuery } from "@/components/store/api/category/categoryApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calender";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dateFormatter } from "@/utils/helper/dateFormatter";
import PreOrderListTab from "./PreOrderListTab";

const OrderTab = () => {
  const [selectOption, setSelectOption] = useState<string | undefined>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
 const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "all";
  const [changeStatus] = useMoveBulkTrustMutation();

  const today = new Date();
  const firstDayPrevMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );

  const [filtering, setFiltering] = useState({
    categoryId: "",
    filterBy: "Both",
    from: firstDayPrevMonth,
    to: today,
  });

  // Fetch orders dynamically
  const toYMD = (d?: Date | null) => (d ? format(d, "yyyy-MM-dd") : undefined);

  const { data: allProducts, isLoading: allLoading } = useGetOrdersQuery({
    sort: "asc",
    page: 1,
    size: 100,
    status: "All",
    fromDate: toYMD(filtering?.from),
    toDate: toYMD(filtering?.to),
    filterBy: "Both",
    categoryId: "",
  }) as any;

  const { data: shippedProduct } = useGetOrdersQuery({
    sort: "asc",
    page: 1,
    size: 100,
    status: "SHIPPED",
    fromDate: toYMD(filtering?.from),
    toDate: toYMD(filtering?.to),
    filterBy: "Both",
    categoryId: "",
  }) as any;

  const { data:preOrder, isLoading } = useGetPreOrdersTabQuery({
      page: 1,
      size: 100,
      status: "All",
      fromDate: toYMD(filtering?.from),
      toDate: toYMD(filtering?.to),
      filterBy: "Both",
      categoryId: "",
    });
  

  const [pagination] = useState({
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

  const { data: categories } = useGetAllCategoryQuery({
    page: 1,
    size: 100,
  });
  const { data } = useGetTrustOrdersQuery({
    page: pagination.page,
    size: pagination.size,
  });

  // trash order handler
  const handleTrustOrder = async (order?: unknown) => {
    try {
      const ordersToUpdate = order ? [order] : selectedRows;

      if (ordersToUpdate.length === 0) {
        toast.error("Please select at least one order");
        return;
      }

      const orderIds = ordersToUpdate.map((o) => o.id);
      const result = await changeStatus(orderIds);
      if (result?.data?.success) {
        console.log(
          "Orders moved to trust successfully:",
          result?.data?.success
        );
        toast.success(
          `${ordersToUpdate.length} order(s) moved to trust successfully`
        );

        if (!order) setSelectedRows([]);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to move orders to trust");
    }
  };

  // pring invoice handler
  const invoiceRef = useRef<HTMLDivElement>(null);
  const deliverySlipRef = useRef<HTMLDivElement>(null);

  // Create separate print functions for both print options
  const reactToPrintInvoice = useReactToPrint({ contentRef: invoiceRef });
  const reactToPrintDeliverySlip = useReactToPrint({
    contentRef: deliverySlipRef,
  });

  const csvLinkRef = useRef<any>(null);

  const handleExportExcel = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one order");
      return;
    }
    // Trigger the CSV download
    if (csvLinkRef.current) {
      csvLinkRef.current.link.click();
    }
  };

  const [pdfDownload, setPdfDownload] = useState<{
    active: boolean;
    orders: any[];
  } | null>(null);

  const handlePDFDownload = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one order");
      return;
    }
    setPdfDownload({
      active: true,
      orders: selectedRows,
    });
  };

  useEffect(() => {
    if (
      selectOption === "completed" ||
      selectOption === "delivery" ||
      selectOption === "inDelivery" ||
      selectOption === "shipped" ||
      selectOption === "processing" ||
      selectOption === "cancelled" ||
      selectOption === "onHold" ||
      selectOption === "confirm"
    ) {
      setModalOpen(true);
    }
  }, [selectOption]);

  // Reset download state after completion
  useEffect(() => {
    if (pdfDownload?.active) {
      setPdfDownload(null);
    }
  }, [pdfDownload]);

  const pending = allProducts?.meta?.statusCounts?.find(
    (c) => c.orderStatus === "PENDING"
  );
  const confirm = allProducts?.meta?.statusCounts?.find(
    (c) => c.orderStatus === "CONFIRMED"
  );
  const cancell = allProducts?.meta?.statusCounts?.find(
    (c) => c.orderStatus === "CANCELLED"
  );
  const fullfill = allProducts?.meta?.statusCounts?.find(
    (c) => c.orderStatus === "PROCESSING"
  );
  const fullfillCancel = allProducts?.meta?.statusCounts?.find(
    (c) => c.orderStatus === "HOLD"
  );
  const ship = allProducts?.meta?.statusCounts?.find(
    (c) => c.orderStatus === "IN_DELIVERY"
  );
  const delivered = allProducts?.meta?.statusCounts?.find(
    (c) => c.orderStatus === "DELIVERED"
  );
  const completed = allProducts?.meta?.statusCounts?.find(
    (c) => c.orderStatus === "COMPLETED"
  );

  if (allLoading || isLoading) {
    return <LoaderSpinner />;
  }

  return (
    <>
      <div className="flex items-center gap-3 justify-between">
        <div className="flex  items-center gap-5">
          <h1 className="text-2xl font-semibold">Orders</h1>
          <div>
            {/* yousuf start */}
            <select
              className="border rounded px-4 py-1.5 text-blue-500 w-full"
              onChange={(e) => {
                setSelectOption(e.target.value);
              }}
              value={selectOption}
            >
              <option value="">Bulk Action</option>
              <option value="orderExcel">
                Export as XLSX ({selectedRows.length})
              </option>
              <option value="confirm">
                Change Status to confirm ({selectedRows.length})
              </option>
              <option value="onHold">
                Change Status to on-hold ({selectedRows.length})
              </option>
              <option value="cancelled">
                Change Status to cancelled ({selectedRows.length})
              </option>
              <option value="processing">
                Change Status to processing ({selectedRows.length})
              </option>
              <option value="shipped">
                Change Status to shipped ({selectedRows.length})
              </option>
              <option value="inDelivery">
                Change Status to in-delivery ({selectedRows.length})
              </option>
              <option value="delivery">
                Change Status to delivery ({selectedRows.length})
              </option>
              <option value="completed">
                Change Status to completed ({selectedRows.length})
              </option>
              <option value="MoveToTrash">
                Move to trash ({selectedRows.length})
              </option>
              <option value="printInvoice">
                Print Invoice ({selectedRows.length})
              </option>
              <option value="printPickingSlip">
                Print Delivery Slip ({selectedRows.length})
              </option>
              {/* <option value="pdfInvoice">
                PDF Invoice ({selectedRows.length})
              </option> */}
              {/* <option value="pdfPackingSlip">
                PDF Packing slip ({selectedRows.length})
              </option> */}
            </select>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded disabled:opacity-50"
            disabled={!selectOption}
            onClick={() => {
              if (!selectOption) return;

              if (selectOption === "MoveToTrash") {
                handleTrustOrder();
              } else if (selectOption === "printInvoice") {
                reactToPrintInvoice();
              } else if (selectOption === "printPickingSlip") {
                reactToPrintDeliverySlip();
              } else if (selectOption === "pdfInvoice") {
                handlePDFDownload();
              } else if (selectOption === "pdfPackingSlip") {
                handlePDFDownload();
              } else if (selectOption === "orderExcel") {
                handleExportExcel();
              }
            }}
          >
            Apply
          </button>
          <Select
            value={filtering.categoryId || "all"}
            onValueChange={(value) =>
              setFiltering((prev) => ({
                ...prev,
                categoryId: value === "all" ? "" : value,
              }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.data?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* User Filter */}
          <Select
            value={filtering.filterBy || "Both"}
            onValueChange={(value) =>
              setFiltering((prev) => ({
                ...prev,
                filterBy: value,
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Both">All Users</SelectItem>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger id="date_range" asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !filtering.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filtering?.from ? (
                  filtering.to ? (
                    `${dateFormatter(filtering.from)} - ${dateFormatter(
                      filtering.to
                    )}`
                  ) : (
                    dateFormatter(filtering.from)
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filtering?.from}
                selected={{
                  from: filtering.from,
                  to: filtering.to,
                }}
                onSelect={(range: any) =>
                  setFiltering((prevState) => ({
                    ...prevState,
                    from: range?.from || new Date(),
                    to: range?.to || range?.from || new Date(),
                  }))
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          {/* <PDFDownloadLink
            document={<MultiOrderPDF orders={selectedRows} />}
            fileName={`orders_${new Date().toISOString().slice(0, 10)}.pdf`}
          >
            {({ url, loading, error }) => (
              <div>
                {loading && <span>Loading PDF for manual download...</span>}
                {error && <span>Error: {error.message}</span>}
                {url && (
                  <a href={url} download>
                    Click to Download PDF (Debug)
                  </a>
                )}
              </div>
            )}
          </PDFDownloadLink> */}
          {/* yousuf end */}
        </div>
        <div>
          <Link to={"/kry-admin-portal/create-order"}>
            <button className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">
              <Plus className="font-bold w-4 h-4" /> Add Order
            </button>
          </Link>
        </div>
      </div>
      <Tabs defaultValue="all"  value={currentTab}
        onValueChange={(value) => {
          setSearchParams({ tab: value });
        }} className="mt-5">
        <TabsList className="border gap-2">
          <TabsTrigger
            value="all"
            className="text-xs font-semibold px-2 py-1 flex gap-1"
          >
            All Orders{" "}
            <span className="text-primary">
              ({allProducts?.meta?.total || 0})
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="PENDING"
            className="text-xs font-semibold px-2 py-1 flex gap-1"
          >
            Pending{" "}
            <span className="text-primary">
              ({pending?._count?.orderStatus || 0})
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="CONFIRMED"
            className="text-xs font-semibold px-2 py-1 flex gap-1"
          >
            Confirmed{" "}
            <span className="text-primary">
              ({confirm?._count?.orderStatus || 0})
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="TODAY_CONFIRM"
            className="text-xs font-semibold px-2 py-1 flex gap-1"
          >
            Today Confirmed{" "}
            <span className="text-primary">
              ({allProducts?.meta?.todayConfirmOrder || 0})
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="CANCELLED"
            className="text-xs font-semibold px-2 py-1 flex gap-1"
          >
            Cancelled{" "}
            <span className="text-red-600">
              ({cancell?._count?.orderStatus || 0})
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="HOLD"
            className="text-xs font-semibold px-2 py-1 flex gap-1"
          >
            Hold{" "}
            <span className="text-red-600">
              ({fullfillCancel?._count?.orderStatus || 0})
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="PROCESSING"
            className="text-xs font-semibold px-2 py-1 flex gap-1"
          >
            Processing{" "}
            <span className="text-primary">
              ({fullfill?._count?.orderStatus || 0})
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="SHIPPED"
            className="text-xs font-semibold px-2 py-1 flex gap-1"
          >
            Shipped{" "}
            <span className="text-primary">
              ({shippedProduct?.data?.length || 0})
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="IN_DELIVERY"
            className="text-xs font-semibold px-2 py-1 flex gap-1"
          >
            In Delivered{" "}
            <span className="text-blue-600">
              ({ship?._count?.orderStatus || 0})
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="DELIVERED"
            className="text-xs font-semibold px-2 py-1 flex gap-1"
          >
            Delivered{" "}
            <span className="text-blue-600">
              ({delivered?._count?.orderStatus || 0})
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="COMPLETED"
            className="text-xs font-semibold px-2 py-1 flex gap-1"
          >
            Completed{" "}
            <span className="text-green-600">
              ({completed?._count?.orderStatus || 0})
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="TRUST_ORDER"
            className="text-xs font-semibold px-2 py-1 flex gap-1"
          >
            Trash Order{" "}
            <span className="text-green-600">({data?.meta?.total || 0})</span>
          </TabsTrigger>
          <TabsTrigger
            value="PRE_ORDER"
            className="text-xs font-semibold px-2 py-1 flex gap-1"
          >
            Pre Order{" "}
            <span className="text-green-600">({preOrder?.meta?.total || 0})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <OrderList
            handleTrustOrder={handleTrustOrder}
            selectedRow={selectedRows}
            setSelectedRow={setSelectedRows}
            filterBy={filtering?.filterBy}
            categoryId={filtering?.categoryId}
            from={filtering?.from}
            to={filtering?.to}
          />
        </TabsContent>

        <TabsContent value="PENDING">
          <PendingOrder
            selectedRow={selectedRows}
            setSelectedRow={setSelectedRows}
            filterBy={filtering?.filterBy}
            categoryId={filtering?.categoryId}
            from={filtering?.from}
            to={filtering?.to}
          />
        </TabsContent>

        <TabsContent value="CONFIRMED">
          <ConfirmOrder
            selectedRow={selectedRows}
            setSelectedRow={setSelectedRows}
            filterBy={filtering?.filterBy}
            categoryId={filtering?.categoryId}
            from={filtering?.from}
            to={filtering?.to}
          />
        </TabsContent>

        <TabsContent value="TODAY_CONFIRM">
          <TodayConfirmOrder
            selectedRow={selectedRows}
            setSelectedRow={setSelectedRows}
            filterBy={filtering?.filterBy}
            categoryId={filtering?.categoryId}
            from={filtering?.from}
            to={filtering?.to}
          />
        </TabsContent>

        <TabsContent value="CANCELLED">
          <CancellOrder
            selectedRow={selectedRows}
            setSelectedRow={setSelectedRows}
            filterBy={filtering?.filterBy}
            categoryId={filtering?.categoryId}
            from={filtering?.from}
            to={filtering?.to}
          />
        </TabsContent>

        <TabsContent value="PROCESSING">
          <FullfillOrder
            selectedRow={selectedRows}
            setSelectedRow={setSelectedRows}
            filterBy={filtering?.filterBy}
            categoryId={filtering?.categoryId}
            from={filtering?.from}
            to={filtering?.to}
          />
        </TabsContent>

        <TabsContent value="HOLD">
          <FullfillCancellOrder
            selectedRow={selectedRows}
            setSelectedRow={setSelectedRows}
            filterBy={filtering?.filterBy}
            categoryId={filtering?.categoryId}
            from={filtering?.from}
            to={filtering?.to}
          />
        </TabsContent>

        <TabsContent value="SHIPPED">
          <Shipped
            selectedRow={selectedRows}
            setSelectedRow={setSelectedRows}
            filterBy={filtering?.filterBy}
            categoryId={filtering?.categoryId}
            from={filtering?.from}
            to={filtering?.to}
          />
        </TabsContent>

        <TabsContent value="IN_DELIVERY">
          <ShippedOrder
            selectedRow={selectedRows}
            setSelectedRow={setSelectedRows}
            filterBy={filtering?.filterBy}
            categoryId={filtering?.categoryId}
            from={filtering?.from}
            to={filtering?.to}
          />
        </TabsContent>

        <TabsContent value="DELIVERED">
          <DeliveredOrder
            selectedRow={selectedRows}
            setSelectedRow={setSelectedRows}
            filterBy={filtering?.filterBy}
            categoryId={filtering?.categoryId}
            from={filtering?.from}
            to={filtering?.to}
          />
        </TabsContent>

        <TabsContent value="COMPLETED">
          <CompletedOrder
            selectedRow={selectedRows}
            setSelectedRow={setSelectedRows}
            filterBy={filtering?.filterBy}
            categoryId={filtering?.categoryId}
            from={filtering?.from}
            to={filtering?.to}
          />
        </TabsContent>

        <TabsContent value="TRUST_ORDER">
          <TrustOrder />
        </TabsContent>

        <TabsContent value="PRE_ORDER">
          <PreOrderListTab
            selectedRow={selectedRows}
            setSelectedRow={setSelectedRows}
            filterBy={filtering?.filterBy}
            categoryId={filtering?.categoryId}
            from={filtering?.from}
            to={filtering?.to}
          />
        </TabsContent>
      </Tabs>

      <div className="invisible hidden -left-full">
        {selectedRows.length > 0 && (
          <OrderInvoicePrint ref={invoiceRef} orderData={selectedRows} />
        )}
        {selectedRows.length > 0 && (
          <DeliverySlipPrint ref={deliverySlipRef} orderData={selectedRows} />
        )}
      </div>

      <UpdateBulkOrderStatus
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectOption("");
          setSelectedRows([]);
        }}
        orderIds={selectedRows.map((row) => row.id)}
        selectOption={selectOption}
      />
      {/* Hidden PDF download trigger */}
      {pdfDownload?.active && (
        <div style={{ display: "none" }}>
          <div>
            <PDFDownloadLink
              document={<MultiOrderPDF orders={pdfDownload.orders} />}
              fileName={`orders_${new Date().toISOString().slice(0, 10)}.pdf`}
            >
              {({ url, loading, error }) => (
                <div>
                  {loading && <span>Loading PDF for manual download...</span>}
                  {error && <span>Error: {error.message}</span>}
                  {url && (
                    <a href={url} download>
                      Click to Download PDF (Debug)
                    </a>
                  )}
                </div>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      )}

      <div>
        <OrderExcel
          data={selectedRows}
          ref={csvLinkRef}
          disabled={selectedRows.length === 0}
        />
      </div>
    </>
  );
};

export default OrderTab;
