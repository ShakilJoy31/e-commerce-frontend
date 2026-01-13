import PageWrapper from "@/components/common/wrapper/PageWrapper";
import Table from "@/components/ui/table";
import { AlertCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import Pagination from "@/components/ui/pagination";
import ButtonLoader from "@/components/loader/ButtonLoader";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
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
import { useToast } from "@/components/ui/use-toast";
import AddEditWarrantyModal from "./AddEditWarrantyModal";
import { useAddWarrantyMutation, useDeleteWarrantyMutation, useGetWarrantiesQuery, useUpdateWarrantyMutation } from "@/components/store/api/warranty/warrantyApi";
const WarrantyList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const [currentWarranty, setCurrentWarranty] = useState<
    { id: number | null; name: string } | undefined
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
  const { data, isLoading, isError, refetch } = useGetWarrantiesQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });
  const [addWarranty, {isLoading:addLoading, error:addError}] = useAddWarrantyMutation();
  const [updateWarranty, {isLoading:editLoading, error:editError}] = useUpdateWarrantyMutation();
  const [deleteWarranty, { isLoading: deleteLoading, error: deleteError }] = useDeleteWarrantyMutation();

  // Size List
  const warraties = data?.data || [];
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

  const handleSaveWarranty = async (id: number | null, name: string) => {
    try {
      if (id) {
        // Update Size
      const result=  await updateWarranty({ id, data: { name } }).unwrap();
      if (result.success) {
        toast({
          title: "Update Warranty Message",
          description: toastMessageGenerator("update", "warranty"),
        });
        setModalOpen(false);
      }
      } else {
        // Add Size
       const result= await addWarranty({ name }).unwrap();
       if (result.success) {
        toast({
          title: "Add Warranty Message",
          description: toastMessageGenerator("add", "warranty"),
        });
        setModalOpen(false);
      }
      }
      refetch(); 
    } catch (err) {
      console.error("Error saving warranty:", err);
    }
  };

  const handleDeleteWarranty = async (id: number) => {
    try {
      await deleteWarranty(id).unwrap();
      toast({
        title: "Warranty deleted successfully",
        description: "The warranty has been deleted.",
      });
      refetch(); // Refresh the size list
    } catch (err) {
      console.error("Error deleting warranty:", err);
    }
  };

  const handleAddWarranty = () => {
    setCurrentWarranty(undefined);
    setModalOpen(true);
  };

  const handleEditSize = (size: any) => {
    setCurrentWarranty(size);
    setModalOpen(true);
  };

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Warranty</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">
              Export
            </button>
            <button
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddWarranty}
            >
              <Plus className="font-bold w-4 h-4" /> Add Warranty
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
        {isLoading && <LoaderSpinner/>}

        {/* Error State */}
        {isError && (
          <div className="text-center py-6 text-red-500">
            Failed to fetch Warranty.
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <Table
            headers={["SL", "Warranty", "Action"]}
            data={warraties}
            selectedRows={selectedRows}
            onRowSelect={(id) => {
              setSelectedRows((prev) =>
                prev.includes(id)
                  ? prev.filter((rowId) => rowId !== id)
                  : [...prev, id]
              );
            }}
            onSelectAll={() => {
              if (selectedRows.length === warraties.length) {
                setSelectedRows([]);
              } else {
                setSelectedRows(warraties.map((warranty) => warranty.id));
              }
            }}
            renderRow={(row, index: number) => {
              const dynamicIndex =
                index + 1 + (pagination.page - 1) * pagination.size;
              return (
                <>
                  <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                  <td className="px-4 py-2 font-medium">{row.name}</td>
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
                            onClick={() => handleDeleteWarranty(row.id)}
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
            <AlertTitle>Warranty Error</AlertTitle>
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
        <AddEditWarrantyModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveWarranty}
          currentWarranty={currentWarranty}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default WarrantyList;
