import PageWrapper from "@/components/common/wrapper/PageWrapper";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import Table from "@/components/ui/table";
import { AlertCircle, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import Pagination from "@/components/ui/pagination"; // Assuming you have a Pagination component
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { useAddSizeMutation, useDeleteSizeMutation, useGetSizesQuery, useUpdateSizeMutation } from "@/components/store/api/size/sizeApi";
import AddEditSizeModal from "./AddEditSizeModal";

const SizeList = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentSize, setCurrentSize] = useState<
    | {
        id: number | null;
        size: string;
      }
    | undefined
  >(undefined);

  // Pagination State
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
  const { data, isLoading, isError, refetch } = useGetSizesQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });
  const [addSize, {isLoading:addLoading, error:addError}] = useAddSizeMutation();
  const [updateSize, {isLoading:editLoading, error:editError}] = useUpdateSizeMutation();
  const [deleteSize, { isLoading: deleteLoading, error: deleteError }] =
    useDeleteSizeMutation();

  // Color List
  const sizes = data?.data || [];

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

  const handleSaveSize = async (
    id: number | null,
    size: string,
  ) => {
    try {
      if (id) {
        const allColor = {
          size: size,
        };
        // Update Color
        const result = await updateSize({ id, data: allColor }).unwrap();
        if (result.success) {
          toast({
            title: "Update Size Message",
            description: toastMessageGenerator("update", "size"),
          });
          setModalOpen(false);
        }
      } else {
        const allColor = {
          size: size,
        };
        // Add Color
       const result= await addSize(allColor).unwrap();
       if (result.success) {
        toast({
          title: "Add Size Message",
          description: toastMessageGenerator("add", "size"),
        });
        setModalOpen(false);
      }
      }
      refetch(); 
    } catch (err) {
      console.error("Error saving size:", err);
    }
  };

  const handleDeleteSize = async (id: number) => {
    try {
      await deleteSize(id).unwrap();
      toast({
        title: "Size deleted successfully",
        description: "The size has been deleted.",
      });
      refetch(); // Refresh the color list
    } catch (err) {
      console.error("Error deleting size:", err);
    }
  };

  const handleAddSize = () => {
    setCurrentSize(undefined);
    setModalOpen(true);
  };

  const handleEditSize = (size: any) => {
    setCurrentSize(size);
    setModalOpen(true);
  };

  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === sizes.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(sizes.map((color) => color.id));
    }
  };

  // Pagination Logic
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

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Sizes</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">
              Export
            </button>
            <button
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddSize}
            >
              <Plus className="font-bold w-4 h-4" /> Add Size
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

        {/* Loading State */}
        {isLoading && <LoaderSpinner />}

        {/* Error State */}
        {isError && (
          <div className="text-center py-6 text-red-500">
            Failed to fetch sizes.
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <Table
            headers={["SL", "Size", "Action"]}
            data={sizes}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
            renderRow={(row, index) => {
              // Calculate dynamic index
              const dynamicIndex =
                index + 1 + (pagination.page - 1) * pagination.size;
              return (
                <>
                  <td className="px-4 py-2">{dynamicIndex}</td>{" "}
                  {/* Dynamic Index */}
                  <td className="px-4 py-2 font-medium">{row.size}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditSize(row)}
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
                            onClick={() => handleDeleteSize(row.id)}
                          >
                            {deleteLoading && <ButtonLoader />} Confirm
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
            <AlertTitle>Size Error</AlertTitle>
            <AlertDescription>
              {(deleteError.data as { message?: string })?.message ||
                "Something went wrong! Please try again."}
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

        {/* Add/Edit Modal */}
        <AddEditSizeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveSize}
          currentSize={currentSize}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default SizeList;
