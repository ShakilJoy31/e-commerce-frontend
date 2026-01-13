import PageWrapper from "@/components/common/wrapper/PageWrapper";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
  useAddFeatureMutation,
  useDeleteFeatureMutation,
  useGetFeatureQuery,
  useUpdateFeatureMutation,
} from "@/components/store/api/featureKey/featurekeyApi";
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
import Table from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import AddEditFeatureModal from "./AddEditFeatureKeyModal";
import Pagination from "@/components/ui/pagination";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ButtonLoader from "@/components/loader/ButtonLoader";

const FeatureList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentFeature, setCurrentFeature] = useState<
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
  const { data, isLoading, isError, refetch } = useGetFeatureQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });
  const [addFeature, { isLoading: addLoading, error: addError }] =
    useAddFeatureMutation();
  const [updateFeature, { isLoading: editLoading, error: editError }] =
    useUpdateFeatureMutation();
  const [deleteFeature, { isLoading: deleteLoading, error: deleteError }] =
    useDeleteFeatureMutation();

  // Features List
  const features = data?.data || [];

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

  const handleSaveFeature = async (id: number | null, name: string) => {
    try {
      if (id) {
        const result = await updateFeature({ id, data: { name } }).unwrap();
        if (result.success) {
          toast({
            title: "Update Attribute Message",
            description: toastMessageGenerator("update", "attribute"),
          });
          setModalOpen(false);
        }
      } else {
        const result = await addFeature({ name }).unwrap();
        if (result.success) {
          toast({
            title: "Add Attribute Message",
            description: toastMessageGenerator("add", "attribute"),
          });
          setModalOpen(false);
        }
      }
      refetch();
    } catch (err) {
      toast({ title: "Error saving attribute.", variant: "destructive" });
      console.error("Error saving attribute:", err);
    }
  };

  const handleDeleteFeature = async (id: number) => {
    try {
      await deleteFeature(id).unwrap();
      toast({ title: "Attribute key deleted successfully!", variant: "default" });
      refetch();
    } catch (err) {
      toast({ title: "Error deleting attribute key.", variant: "destructive" });
      console.error("Error deleting attribute:", err);
    }
  };

  const handleAddFeature = () => {
    setCurrentFeature(undefined);
    setModalOpen(true);
  };

  const handleEditFeature = (feature: any) => {
    setCurrentFeature(feature);
    setModalOpen(true);
  };

  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === features.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(features.map((feature) => feature.id));
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
          <h1 className="text-2xl font-semibold">Attribute Key</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">
              Export
            </button>
            <button
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddFeature}
            >
              <Plus className="font-bold w-4 h-4" /> Add Attribute
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

        {/* Loading and Error State */}
        {isLoading && <LoaderSpinner />}
        {isError && (
          <div className="text-center py-6 text-red-500">
            Failed to fetch attributes.
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <Table
            headers={["SL", "Attribute Key", "Action"]}
            data={features}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
            renderRow={(row, index) => {
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
                      onClick={() => handleEditFeature(row)}
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
                            onClick={() => handleDeleteFeature(row.id)}
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
            <AlertTitle>Feature Key Error</AlertTitle>
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
        <AddEditFeatureModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveFeature}
          currentFeature={currentFeature}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default FeatureList;
