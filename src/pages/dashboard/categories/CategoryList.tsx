import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
  useDeleteCategoryMutation,
  useGetAllCategoryQuery,
} from "@/components/store/api/category/categoryApi";
import { useState, useEffect } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import defimg from "../../../assets/images/category/def.webp";
import Pagination from "@/components/ui/pagination";
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
import ButtonLoader from "@/components/loader/ButtonLoader";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import AddCategory from "../addCategory/AddCategory";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditCategory from "../addCategory/EditCategory";

export default function CategoryList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [actionItem, setActionItem] = useState(null);
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

  const { data, isLoading, isError, refetch } = useGetAllCategoryQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });

  const [deleteCategory, { isLoading: deleteLoading, error }] =
    useDeleteCategoryMutation();

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
      page, // Update the page value
    }));
  };
  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination((prev) => ({
      ...prev,
      size: itemsPerPage,
      page: 1,
    }));
  };
  // Handle delete action
  const handleDelete = async (id: number) => {
    try {
      const result = await deleteCategory(id).unwrap();

      if (result.success) {
        toast({
          title: "Delete Category",
          description: "Delete Category successfully",
        });
      }
      refetch();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  if (isLoading) {
    return <LoaderSpinner />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="flex justify-start" size="sm">
              + Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[1000px]">
            {/* ADD NEW PRODUCT FORM CONTAINER */}
            <AddCategory setModalOpen={setModalOpen} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center rounded-lg">
        <div className="relative w-1/3 my-4">
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

      {/* Error State */}
      {isError && (
        <div className="text-center text-red-500">
          Failed to load categories
        </div>
      )}

      {/* No Data State */}
      {!isLoading && !isError && data?.data?.length === 0 && (
        <div className="text-center text-gray-500">No data available.</div>
      )}

      {/* Category Grid */}
      {!isLoading && !isError && data?.data?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.data.map((category: any) => (
            <div
              key={category.id}
              className="relative bg-white shadow-md rounded-lg overflow-hidden group"
            >
              <div className="relative h-48">
                {category.image !== "N/A" ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain pt-5 group-hover:brightness-75"
                  />
                ) : (
                  <img
                    src={defimg}
                    alt="default"
                    className="w-full h-full object-cover group-hover:brightness-75"
                  />
                )}

                {/* Hover Overlay with Edit and Delete buttons */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/30">
                  <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="default"
                        className="flex justify-start"
                        size="sm"
                        onMouseEnter={() => setActionItem(category)}
                      >
                        <FiEdit />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[1000px]">
                      {/* ADD NEW PRODUCT FORM CONTAINER */}
                      <EditCategory
                        setModalOpen={setEditModalOpen}
                        actionItem={actionItem}
                      />
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="bg-white text-red-600 px-4 py-2 rounded flex items-center gap-2 ml-2">
                        <FiTrash2 /> Delete
                      </button>
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
                          onClick={() => handleDelete(category.id)}
                        >
                          {deleteLoading && <ButtonLoader />} Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {category.name}
                </h3>
                <p className="text-gray-600">
                  {category?._count?.Product || 0}{" "}
                  {category?._count?.Product > 1 ? "Products" : "Product"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && "data" in error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Login Error</AlertTitle>
          <AlertDescription>
            {(error.data as { message?: string })?.message ||
              "Something went wrong! Try again."}
          </AlertDescription>
        </Alert>
      )}

      {/* Pagination */}
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
  );
}
