import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  useAddSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetSubCategoryQuery,
  useUpdateSubCategoryMutation,
} from "@/components/store/api/subCategory/subCategoryApi";
import Table from "@/components/ui/table";
import { AlertCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import AddEditSubCategoryModal from "../addSubCategory/AddEditSubCategoryModal";
import Pagination from "@/components/ui/pagination";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { useToast } from "@/components/ui/use-toast";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SubCategoryList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const [currentSubCategory, setCurrentSubCategory] = useState<
    | {
        id: number | null;
        name: string;
        isShippedFree:boolean;
        isFullPay:boolean;
        categoryId: number;
        parentSubCategoryId?: number | null;
        children?: Array<{ id: number; name: string }>;
      }
    | undefined
  >(undefined);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
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

  // API Calls
  const { data, isLoading, isError, refetch } = useGetSubCategoryQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });

  const [
    addSubCategory,
    { isLoading: addSubCategoryLoading, error: addError },
  ] = useAddSubCategoryMutation();
  const [
    updateSubCategory,
    { isLoading: updateSubCategoryLoading, error: updateError },
  ] = useUpdateSubCategoryMutation();
  const [
    deleteSubCategory,
    { isLoading: deletesubCategoryLoading, error: deleteError },
  ] = useDeleteSubCategoryMutation();

  const subCategories = data?.data || [];

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


  const handleSaveSubCategory = async (payload: {
    id: number | null;
    name: string;
    isShippedFree:boolean;
    isFullPay:boolean;
    categoryId: number;
    parentSubCategoryId?: number | null; // Update the type to include null
  }) => {
    try {
      // Prepare the data object, omitting parentSubCategoryId if it's null
      const data = {
        name: payload.name,
        isShippedFree:payload.isShippedFree,
        // isFullPay:payload.isFullPay,
        categoryId: payload.categoryId,
        ...(payload.parentSubCategoryId !== null && { parentSubCategoryId: payload.parentSubCategoryId }),
      };

      if (payload.id) {
        // Update Subcategory
        const result = await updateSubCategory({
          id: payload.id,
          data: data,
        }).unwrap();
        if (result.success) {
          toast({
            title: "Update Subcategory Message",
            description: toastMessageGenerator("update", "subcategory"),
          });
          setModalOpen(false);
        }
      } else {
        // Add Subcategory
        const result = await addSubCategory(data).unwrap();

        if (result.success) {
          toast({
            title: "Add Subcategory Message",
            description: toastMessageGenerator("add", "subcategory"),
          });
          setModalOpen(false);
        }
      }
      refetch();
      setModalOpen(false);
    } catch (err) {
      console.error("Error saving subcategory:", err);
    }
  };



  const handleDeleteSubCategory = async (id: number) => {
    try {
      const result = await deleteSubCategory(id).unwrap();
      if (result.success) {
        toast({
          title: "Delete Subcategory Message",
          description: toastMessageGenerator("delete", "subcategory"),
        });
      }
      refetch(); // Refresh the subcategory list
    } catch (err) {
      console.error("Error deleting subcategory:", err);
    }
  };

  const handleAddSubCategory = () => {
    setCurrentSubCategory(undefined);
    setModalOpen(true);
  };

  const handleEditSubCategory = (subcategory: any) => {
    // Find child subcategories
    const children = subCategories
      .filter((sc: any) => sc.parentSubCategoryId === subcategory.id)
      .map((sc: any) => ({ id: sc.id, name: sc.name }));

    setCurrentSubCategory({
      ...subcategory,
      children,
    });
    setModalOpen(true);
  };

  if (isLoading) {
    return <LoaderSpinner />;
  }

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Subcategories</h1>
          <div className="flex items-center gap-2">
            <button
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddSubCategory}
            >
              <Plus className="font-bold w-4 h-4" /> Add Subcategory
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex justify-between items-center bg-white px-4 rounded-lg">
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
          <div className="text-center py-6 text-red-500">
            Failed to fetch subcategories.
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <Table
            headers={["SL", "Category", "Subcategory", "Shipping Status", "Actions"]}
            data={subCategories}
            selectedRows={selectedRows}
            onRowSelect={(id: any) => {
              setSelectedRows((prev) =>
                prev.includes(id)
                  ? prev.filter((rowId) => rowId !== id)
                  : [...prev, id]
              );
            }}
            onSelectAll={() => {
              if (selectedRows.length === subCategories.length) {
                setSelectedRows([]);
              } else {
                setSelectedRows(
                  subCategories.map((subcategory) => subcategory.id)
                );
              }
            }}
            renderRow={(row: any, index: number) => {
              const dynamicIndex =
                index + 1 + (pagination.page - 1) * pagination.size;
              return (
                <>
                  <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                  <td className="px-4 py-2 font-medium">
                    {row?.category?.name}
                  </td>
                  <td className="px-4 py-2">{row.name}</td>
                   <td className="px-4 py-2 font-medium">{row.isShippedFree? "Free":"Paid"}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditSubCategory(row)}
                    >
                      <FiEdit />
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="bg-white text-red-600 px-4 py-2 rounded flex items-center gap-2 ml-2">
                          <FiTrash2 />
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
                            onClick={() => handleDeleteSubCategory(row.id)}
                          >
                            {deletesubCategoryLoading && <ButtonLoader />}{" "}
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </>
              );
            }}
          />
        )}

        {deleteError && "data" in deleteError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Category Error</AlertTitle>
            <AlertDescription>
              {(deleteError.data as { message?: string })?.message ||
                "Something went wrong! Please try again."}
            </AlertDescription>
          </Alert>
        )}

        <div className="my-10">
          <Pagination
            totalPages={pagination.meta.totalPage || 1}
            currentPage={pagination.page}
            itemsPerPage={pagination.size}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>

        {/* Add/Edit Modal */}
        <AddEditSubCategoryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveSubCategory}
          currentSubCategory={currentSubCategory}
          loading={addSubCategoryLoading || updateSubCategoryLoading}
          err={addError || updateError}
        />
      </div>
    </PageWrapper>
  );
};

export default SubCategoryList;