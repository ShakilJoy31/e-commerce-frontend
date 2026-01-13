import { useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InputWrapper from "@/components/common/wrapper/InputWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calender";
import { appConfiguration } from "@/utils/constant/appConfiguration";
import { dateFormatter } from "@/utils/helper/dateFormatter";
import { cn } from "@/lib/utils";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { useGetSalesReportByProductQuery } from "@/components/store/api/order/orderApi";
import SalesReportByProductPdf from "../pdf/SalesReportByProductPdf";
import SalesReportByProductExcel from "../pdf/SalesReportByProductExcel";

const SalesReportByProduct = () => {
  const [selectStatus, setSelectStatus] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const { data: salesReport, isLoading } = useGetSalesReportByProductQuery({
    status: selectStatus,
    from:
      date?.from instanceof Date ? format(date.from, "yyyy-MM-dd") : undefined,
    to: date?.to instanceof Date ? format(date.to, "yyyy-MM-dd") : undefined,
  });

  console.log(salesReport);

  const fromDate = date?.from ? dateFormatter(date?.from) : null;
  const toDate = date?.to ? dateFormatter(date?.to) : null;
  const dateRange = toDate
    ? toDate === fromDate
      ? fromDate
      : `${fromDate} to ${toDate}`
    : fromDate;

  return (
    <div className="bg-white rounded-md">
      <div className="flex justify-between px-5 items-end">
        <div className="space-x-3 flex py-5">
          {/* BUTTON & COMPONENT FOR EXCEL */}
          <SalesReportByProductExcel data={salesReport?.data} />
          {/* BUTTON & COMPONENT FOR PDF */}
          <PDFDownloadLink
            document={<SalesReportByProductPdf data={salesReport?.data} />}
            fileName={`${appConfiguration?.appName} ◉ ${dateRange} ◉ Sales Order Report By Product.pdf`}
          >
            {({ loading }) =>
              loading ? (
                <Button
                  disabled={loading}
                  className="transition-all p-3 duration-150"
                  variant="destructive"
                  size="sm"
                >
                  <ButtonLoader /> Pdf
                </Button>
              ) : (
                <Button variant="destructive" size="sm">
                  Pdf
                </Button>
              )
            }
          </PDFDownloadLink>
        </div>

        <div className="grid gap-2 grid-flow-col">
          <InputWrapper label="Select Status" labelFor="branch">
            <Select
              defaultValue={selectStatus}
              onValueChange={(value: string) => {
                setSelectStatus(value);
              }}
            >
              <SelectTrigger className="w-[250px]" id="branch">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] w-[250px] overflow-y-auto">
                {[
                  "PENDING",
                  "CONFIRMED",
                  "CANCELLED",
                  "PROCESSING",
                  "HOLD",
                  "IN_DELIVERY",
                  "DELIVERED",
                  "COMPLETED",
                ].map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </InputWrapper>

          <InputWrapper label="Select Date Range" labelFor="date_range">
            <Popover>
              <PopoverTrigger id="date_range" asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
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
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>
        </div>
      </div>
      {/* Loading State */}
      {isLoading && <LoaderSpinner />}
      {/* show the select data */}
      <div className="mt-10 bg-white">
        {!isLoading && salesReport?.data?.length > 0 ? (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-white">
                  <th className="px-4 py-2 text-left">Product Name</th>
                  <th className="px-4 py-2 text-left">Size</th>
                
                  {/* <th className="px-4 py-2 text-left">Chipset</th>
                  <th className="px-4 py-2 text-left">Connectivity</th>
                  <th className="px-4 py-2 text-left">Connector</th>
                  <th className="px-4 py-2 text-left">Material</th>
                  <th className="px-4 py-2 text-left">Plug</th>
                  <th className="px-4 py-2 text-left">Region</th> */}
                  <th className="px-4 py-2 text-left">ROM</th>
                  <th className="px-4 py-2 text-left">RAM</th>
                  {/* <th className="px-4 py-2 text-left">SIM</th> */}
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Total Price</th>
                  
                 
                </tr>
              </thead>
              <tbody>
                {salesReport?.data?.map((product) => {
                  // Calculate price per item (totalPrice / quantity)
                  const pricePerItem = product.quantity ? product.totalPrice / product.quantity : 0;

                  return (
                    <tr key={product.variationId} className="border-b">
                      <td className="px-4 py-2">{product.productName}</td>
                      <td className="px-4 py-2">{product.size || "N/A"}</td>
                      
                      {/* <td className="px-4 py-2">{product.chipset}</td> */}
                      {/* <td className="px-4 py-2">{product.connectivity}</td>
                      <td className="px-4 py-2">{product.connector}</td>
                      <td className="px-4 py-2">{product.material}</td> */}
                      {/* <td className="px-4 py-2">{product.plug}</td> */}
                      {/* <td className="px-4 py-2">{product.region}</td> */}
                      <td className="px-4 py-2">{product.rom || "N/A"}</td>
                      <td className="px-4 py-2">{product.ram || "N/A"}</td>
                      {/* <td className="px-4 py-2">{product.sim}</td> */}
                      <td className="px-4 py-2">{product.quantity}</td>
                      <td className="px-4 py-2">{pricePerItem} ৳</td>
                      <td className="px-4 py-2">{product.totalPrice} ৳</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ):<><p className="text-sm font-semibold py-5 text-center">Please select status and date range to get the report</p></>}
      </div>
    </div>
  );
};

export default SalesReportByProduct;
