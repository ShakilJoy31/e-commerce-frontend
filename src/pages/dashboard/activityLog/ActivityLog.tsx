import { useGetDashboardActivityLogQuery } from "@/components/store/api/user/userApi";
import { useEffect, useState } from "react";
import Table from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { FiSearch } from "react-icons/fi";

const ActivityLog = () => {
   const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useState({
    search: "", // Changed to match API expectation
    page: 1,
    size: 100,
  });

  const {
    data: activityLogs,
    isError,
    isLoading,
  } = useGetDashboardActivityLogQuery(searchParams);

  console.log("activity dashboard", activityLogs?.data);
  // Define table headers
  const headers = [
    "SL",
    "Date",
    "Name",
    "Role",
    "Target",
    "Action",
    "Note",
    "Details",
  ];

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const month = date.toLocaleString("en-US", { month: "short" }); // e.g., "May"
    const day = String(date.getDate()).padStart(2, "0"); // e.g., "05"

    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }); // e.g., "3:45 PM"

    return `${month} ${day}, ${time}`;
  };

 useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchParams({
        ...searchParams,
        search: searchTerm, // Now using single search parameter
        page: 1,
      });
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);


  const handlePageChange = (newPage: number) => {
    setSearchParams({
      ...searchParams,
      page: newPage,
    });
  };

  if (isLoading) {
    return <LoaderSpinner />;
  }

  return (
    <PageWrapper>
      <div className="bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Activity Log</h1>

        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-6">
  {/* Single Search Bar */}
  <div className="relative w-60">
    <input
      type="text"
      placeholder="Search by target or action..."
      className="border focus:border-primary rounded pl-10 pr-3 py-1 text-gray-700 w-full"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
  </div>
</div>


          {isError ? (
            <p className="text-red-500">Error loading activity log data.</p>
          ) : activityLogs?.data?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No activity logs found</p>
            </div>
          ) : (
            <>
              <div className="rounded-lg overflow-hidden">
                <div className="min-h-[70vh] max-h-[70vh] overflow-y-auto">
                  <Table
                    headers={headers}
                    data={activityLogs?.data}
                    renderRow={(row: any, index: number) => {
                      return (
                        <>
                          <td className="py-4 whitespace-nowrap text-sm text-gray-700 border-t">
                            {index +
                              1 +
                              (searchParams.page - 1) * searchParams.size}
                          </td>
                          <td className="py-4 whitespace-nowrap text-sm text-gray-700 border-t">
                            {formatDate(row.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-t">
                            {row?.user?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-t">
                            {row?.user?.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-t">
                            {row.target}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap border-t">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                row.action === "Create"
                                  ? "bg-blue-100 text-blue-700"
                                  : row.action === "Update"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {row.action}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-700 border-t">
                            {row.note}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-t">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-gray-100 hover:bg-gray-200"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <div className="space-y-4">
                                  <h2 className="text-xl font-semibold">
                                    Activity Details
                                  </h2>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h3 className="font-medium text-gray-500">
                                        User Information
                                      </h3>
                                      <div className="mt-2 space-y-2">
                                        <p>
                                          <span className="font-medium">
                                            Name:
                                          </span>{" "}
                                          {row.user?.name}
                                        </p>
                                        <p>
                                          <span className="font-medium">
                                            Email:
                                          </span>{" "}
                                          {row.user?.email}
                                        </p>
                                        <p>
                                          <span className="font-medium">
                                            Role:
                                          </span>{" "}
                                          {row.user?.role}
                                        </p>
                                      </div>
                                    </div>

                                    <div>
                                      <h3 className="font-medium text-gray-500">
                                        Device Information
                                      </h3>
                                      <div className="mt-2 space-y-2">
                                        <p>
                                          <span className="font-medium">
                                            Device:
                                          </span>{" "}
                                          {row.deviceInfo?.device}
                                        </p>
                                        <p>
                                          <span className="font-medium">
                                            Model:
                                          </span>{" "}
                                          {row.deviceInfo?.model}
                                        </p>
                                        <p>
                                          <span className="font-medium">
                                            OS:
                                          </span>{" "}
                                          {row.deviceInfo?.os}
                                        </p>
                                        <p>
                                          <span className="font-medium">
                                            Browser:
                                          </span>{" "}
                                          {row.deviceInfo?.browser}
                                        </p>
                                        <p>
                                          <span className="font-medium">
                                            IP:
                                          </span>{" "}
                                          {row.deviceInfo?.ip.slice(7, 100)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h3 className="font-medium text-gray-500">
                                      Action Data
                                    </h3>

                                    <div className="mt-2 bg-gray-50 p-4 rounded">
                                      <pre className="text-sm overflow-auto max-h-60 bg-white p-2 rounded border">
                                        {JSON.stringify(
                                          row.deviceInfo || {},
                                          null,
                                          2
                                        )}
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </td>
                        </>
                      );
                    }}
                    selectedRows={undefined}
                    onRowSelect={undefined}
                    onSelectAll={undefined}
                  />
                </div>
              </div>

              {/* Pagination */}
              {activityLogs?.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Showing page {searchParams.page} of{" "}
                    {activityLogs?.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={searchParams.page === 1}
                      onClick={() => handlePageChange(searchParams.page - 1)}
                    >
                      Previous
                    </Button>
                    {Array.from(
                      { length: Math.min(5, activityLogs?.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (activityLogs?.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (searchParams.page <= 3) {
                          pageNum = i + 1;
                        } else if (
                          searchParams.page >=
                          activityLogs?.totalPages - 2
                        ) {
                          pageNum = activityLogs?.totalPages - 4 + i;
                        } else {
                          pageNum = searchParams.page - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={
                              searchParams.page === pageNum
                                ? "default"
                                : "outline"
                            }
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}
                    <Button
                      variant="outline"
                      disabled={searchParams.page === activityLogs?.totalPages}
                      onClick={() => handlePageChange(searchParams.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ActivityLog;
