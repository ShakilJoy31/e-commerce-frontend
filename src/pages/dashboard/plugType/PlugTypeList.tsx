import PageWrapper from "@/components/common/wrapper/PageWrapper";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import Table from "@/components/ui/table";
import { AlertCircle, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import Pagination from "@/components/ui/pagination";
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
import { useAddPlugTypeMutation, useDeletePlugTypeMutation, useGetPlugTypesQuery, useUpdatePlugTypeMutation } from "@/components/store/api/plugType/plugTypeApi";
import AddEditPlugTypeModal from "./AddEditPlugTypeModal";

const PlugTypeList = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPlugType, setCurrentPlugType] = useState<
    | {
        id: number | null;
        name: string;
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
  const { data, isLoading, isError, refetch } = useGetPlugTypesQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });
  const [addPlugType, { isLoading: addLoading, error: addError }] = useAddPlugTypeMutation();
  const [updatePlugType, { isLoading: editLoading, error: editError }] = useUpdatePlugTypeMutation();
  const [deletePlugType, { isLoading: deleteLoading, error: deleteError }] = useDeletePlugTypeMutation();

  // Plug Type List
  const plugTypes = data?.data || [];

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

  const handleSavePlugType = async (
    id: number | null,
    name: string,
  ) => {
    try {
      if (id) {
        const plugTypeData = {
          name: name,
        };
        // Update Plug Type
        const result = await updatePlugType({ id, data: plugTypeData }).unwrap();
        if (result.success) {
          toast({
            title: "Update Plug Type Message",
            description: toastMessageGenerator("update", "plug type"),
          });
          setModalOpen(false);
        }
      } else {
        const plugTypeData = {
          name: name,
        };
        // Add Plug Type
        const result = await addPlugType(plugTypeData).unwrap();
        if (result.success) {
          toast({
            title: "Add Plug Type Message",
            description: toastMessageGenerator("add", "plug type"),
          });
          setModalOpen(false);
        }
      }
      refetch();
    } catch (err) {
      console.error("Error saving plug type:", err);
    }
  };

  const handleDeletePlugType = async (id: number) => {
    try {
      await deletePlugType(id).unwrap();
      toast({
        title: "Plug Type deleted successfully",
        description: "The plug type has been deleted.",
      });
      refetch(); // Refresh the plug type list
    } catch (err) {
      console.error("Error deleting plug type:", err);
    }
  };

  const handleAddPlugType = () => {
    setCurrentPlugType(undefined);
    setModalOpen(true);
  };

  const handleEditPlugType = (plugType: any) => {
    setCurrentPlugType(plugType);
    setModalOpen(true);
  };

  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === plugTypes.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(plugTypes.map((plugType) => plugType.id));
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
          <h1 className="text-2xl font-semibold">Plug Types</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">
              Export
            </button>
            <button
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddPlugType}
            >
              <Plus className="font-bold w-4 h-4" /> Add Plug Type
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
            Failed to fetch plug types.
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <Table
            headers={["SL", "Plug Type", "Action"]}
            data={plugTypes}
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
                  <td className="px-4 py-2 font-medium">{row.name}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditPlugType(row)}
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
                            Are you sure you want to delete this plug type?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="btn-destructive-fill">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePlugType(row.id)}
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
            <AlertTitle>Plug Type Error</AlertTitle>
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
        <AddEditPlugTypeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSavePlugType}
          currentPlugType={currentPlugType}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default PlugTypeList;
