import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import { Plus } from "lucide-react";
import Table from "@/components/ui/table";
import Pagination from "@/components/ui/pagination";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import ButtonLoader from "@/components/loader/ButtonLoader";
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
import { AlertCircle } from "lucide-react";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import AddEditShippingMethodModal from "./AddEditShippingMethodModal";
import { useCreateShippingMethodMutation, useDeleteShippingMethodMutation, useGetShippingMethodsQuery, useUpdateShippingMethodMutation } from "@/components/store/api/shippingMethod/shippingMethodApi";

const ShippingMethod = () => {
  const [searchTag, setSearchTag] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const [currentTag, setCurrentTag] = useState<{ id: number | null; name: string ; isActive:boolean} | undefined>(undefined);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
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

  const { data, isLoading, isError, refetch } = useGetShippingMethodsQuery({
    page: pagination.page,
    size: pagination.size,
    search: searchTag,
  });

  const [addTag, { isLoading: addLoading, error: addError }] = useCreateShippingMethodMutation();
  const [updateTag, { isLoading: editLoading, error: editError }] = useUpdateShippingMethodMutation();
  const [deleteTag, { isLoading: deleteLoading, error: deleteError }] = useDeleteShippingMethodMutation();

  const tags = data?.data || [];

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
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination((prev) => ({ ...prev, size: itemsPerPage, page: 1 }));
  };

  const handleRowSelect = (tag: any) => {
    setSelectedRows((prev) =>
      prev.some((selectedTag) => selectedTag.id === tag.id)
        ? prev.filter((selectedTag) => selectedTag.id !== tag.id)
        : [...prev, tag]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === tags.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...tags]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      for (const tag of selectedRows) {
        await deleteTag(tag.id).unwrap();
      }
      toast({
        title: "Success",
        description: "Selected courier have been deleted successfully",
      });
      setSelectedRows([]);
      refetch();
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to delete selected tags",
        variant: "destructive",
      });
    }
  };

 const handleSaveTag = async (
  id: number | null, 
  name: string, 
  price: number, 
  isActive: boolean,
  shipped: string
) => {
  try {
    const data = { name, price, isActive, shipped };
    const result = id
      ? await updateTag({ id, data }).unwrap()
      : await addTag(data).unwrap();

    if (result.success) {
      toast({
        title: id ? "Update Courier" : "Add Courier",
        description: toastMessageGenerator(id ? "update" : "add", "courier"),
      });
      setModalOpen(false);
      refetch();
    }
  } catch (err) {
    console.error("Error saving tag:", err);
  }
};

  const handleDeleteTag = async (id: number) => {
    try {
      await deleteTag(id).unwrap();
      toast({ title: "Courier deleted successfully", description: "The courier has been deleted." });
      refetch();
    } catch (err) {
      console.error("Error deleting courier:", err);
    }
  };

  const handleAddTag = () => {
    setCurrentTag(undefined);
    setModalOpen(true);
  };

  const handleEditTag = (tag: any) => {
    setCurrentTag(tag);
    setModalOpen(true);
  };

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Shipping Method</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">Export</button>
            <button
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddTag}
            >
              <Plus className="font-bold w-4 h-4" /> Add Shipping Method
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center bg-white px-4 rounded-lg">
          <div className="relative w-1/3 my-4">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded pl-10 pr-3 py-1 text-gray-700 w-60"
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="space-x-2 py-5">
            <button
              onClick={handleDeleteSelected}
              disabled={selectedRows.length === 0}
              className={`px-4 py-1.5 -mt-1 rounded border ${
                selectedRows.length > 0
                  ? "text-red-500 border-red-500 hover:bg-red-50"
                  : "text-gray-400 border-gray-300 cursor-not-allowed"
              }`}
            >
              <FiTrash2 className="inline-block mr-1" /> Delete Selected
            </button>
          </div>
        </div>

        {isLoading && <LoaderSpinner />}
        {isError && <div className="text-center py-6 text-red-500">Failed to fetch shipping method.</div>}

        {!isLoading && !isError && (
          <Table
            headers={["SL", "Shipping Method", "Shipped", "Status", "Price", "Actions"]}
            data={tags}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
            renderRow={(row, index: number) => {
              const dynamicIndex = index + 1 + (pagination.page - 1) * pagination.size;
              return (
                <>
                  <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                  <td className="px-4 py-2 font-medium">{row.name}</td>
                  <td className="px-4 py-2 font-medium">{row?.shipped==="In_Dhaka"? "Inside Dhaka": row?.shipped==="Out_Dhaka"? "Outside Dhaka":"Both"}</td>
                  <td className="px-4 py-2 font-medium">{row.isActive===true? <span className="text-green-600">Active</span>:<span className="text-red-600">Inactive</span>}</td>
                  <td className="px-4 py-2 font-medium">{row.price}</td>
                  
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditTag(row)}
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
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteTag(row.id)}>
                            {deleteLoading && <ButtonLoader />} Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                  {/* <td></td> */}
                </>
              );
            }}
          />
        )}

        {deleteError && "data" in deleteError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Delete Error</AlertTitle>
            <AlertDescription>
              {(deleteError.data as { message?: string })?.message || "Something went wrong!"}
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

        <AddEditShippingMethodModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveTag}
          currentTag={currentTag}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default ShippingMethod;