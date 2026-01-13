import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Button } from "@/components/ui/button";
import Table from "@/components/ui/table";
import { AlertCircle, MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
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
  useDeletePageMutation,
  useGetPagesQuery,
} from "@/components/store/api/pages/pageApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Updated headers to match the page data
const headers = [
  "SL",
  "Title",
  "Slug",
  "SEO Title",
  "SEO Description",
  "Action",
];

const TrashPageList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
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

  const all = "Trust";
  const { data, isLoading, isError, refetch } = useGetPagesQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
    status: all,
  });

  const [deletePage, { isLoading: deleteLoading, error: deleteError }] =
    useDeletePageMutation();

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

  const handleRowSelect = (page: any) => {
    setSelectedRows((prev) =>
      prev.some((selectedPage) => selectedPage.id === page.id)
        ? prev.filter((selectedPage) => selectedPage.id !== page.id)
        : [...prev, page]
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
    for (const page of selectedRows) {
      await deletePage(page.id);
    }
    setSelectedRows([]);
    refetch();
  };

  const handleRowClick = (pageId: number) => {
    navigate(`/kry-admin-portal/page-details/${pageId}`);
  };

  const handleDeletePage = async (id: number) => {
    try {
      await deletePage(id).unwrap();
      toast({
        title: "Page deleted successfully",
        description: "The page has been deleted.",
      });
      refetch();
    } catch (err) {
      console.error("Error deleting page:", err);
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
                placeholder="Search pages..."
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
            <Link to={"/kry-admin-portal/add-new-pages"}>
              <Button>
                <Plus /> Add Page
              </Button>
            </Link>
          </div>
        </div>

        {/* Pages Table */}
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
                    className="px-4 py-2 text-blue-500 font-medium cursor-pointer"
                  >
                    {row.title}
                  </td>
                  <td className="px-4 py-2">{row.slug}</td>
                  <td className="px-4 py-2">{row.seoTitle || "N/A"}</td>
                  <td className="px-4 py-2 max-w-xs truncate">
                    {row.seoDescription || "N/A"}
                  </td>

                  <td className="px-4 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="flex flex-col gap-1"
                      >
                        <DropdownMenuLabel>Page Actions</DropdownMenuLabel>
                        <a
                          target="_blank"
                          href={`/kry-admin-portal/update-page/${row?.slug}`}
                        >
                          {" "}
                          <Button
                            variant="outline"
                            className="w-full flex justify-start h-7"
                            size="sm"
                          >
                            Edit
                          </Button>
                        </a>
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
                                This action cannot be undone. This will
                                permanently delete the page.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="btn-destructive-fill">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePage(row.id)}
                              >
                                {deleteLoading && <ButtonLoader />} Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
            <AlertTitle>Page Error</AlertTitle>
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

export default TrashPageList;
