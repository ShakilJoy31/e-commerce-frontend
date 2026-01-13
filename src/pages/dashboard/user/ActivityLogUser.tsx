import { useGetUserActivityLogQuery } from "@/components/store/api/user/userApi";
import { useParams } from "react-router-dom";
import Table from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import PageWrapper from "@/components/common/wrapper/PageWrapper";

const ActivityLogUser = () => {
  const { id } = useParams();
  const {
    data: adminActivity,
    isError,
    isLoading,
  } = useGetUserActivityLogQuery(id);

  console.log(adminActivity?.data)

  // Define table headers as an array of strings
  const headers = ["Date", "Action", "Target", "Note", "Details"];

  // Format date to a more readable format
const formatDate = (dateString) => {
  const date = new Date(dateString);

  const month = date.toLocaleString('en-US', { month: 'short' }); // e.g., "May"
  const day = String(date.getDate()).padStart(2, '0');            // e.g., "05"

  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }); // e.g., "3:45 PM"

  return `${month} ${day}, ${time}`;
};

  if (isLoading) {
    return <LoaderSpinner />;
  }

  return (
    <PageWrapper>
      <div className="bg-gray-100">
        <div className="bg-white rounded-lg p-4">
          <h1 className="text-2xl font-bold mb-6">Activity Log</h1>

          {isError ? (
            <p className="text-red-500">Error loading activity log data.</p>
          ) : adminActivity?.data?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No activity logs found</p>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden">
              <Table
                headers={headers}
                data={adminActivity?.data}
                renderRow={(row: any) => {
                  return (
                    <>
                      <td className="py-4 whitespace-nowrap text-sm text-gray-700 border-t">
                        {formatDate(row.createdAt)}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-t">
                        {row.target}
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
                                      <span className="font-medium">Name:</span>{" "}
                                      {row.user?.name}
                                    </p>
                                    <p>
                                      <span className="font-medium">
                                        Email:
                                      </span>{" "}
                                      {row.user?.email}
                                    </p>
                                    <p>
                                      <span className="font-medium">Role:</span>{" "}
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
                                        Browser:
                                      </span>{" "}
                                      {row.deviceInfo?.browser}
                                    </p>
                                    <p>
                                      <span className="font-medium">OS:</span>{" "}
                                      {row.deviceInfo?.os}
                                    </p>
                                    <p>
                                      <span className="font-medium">IP:</span>{" "}
                                      {row.deviceInfo?.ip}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h3 className="font-medium text-gray-500">
                                  Action Data
                                </h3>
                                <div className="mt-2 bg-gray-50 p-4 rounded">
                                  <pre className="text-sm overflow-auto max-h-60">
                                    {JSON.stringify(row.data, null, 2)}
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
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ActivityLogUser;
