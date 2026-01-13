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
import { 
  useAddRegularWarrantyMutation, 
  useDeleteRegularWarrantyMutation, 
  useGetRegularWarrantiesQuery, 
  useUpdateRegularWarrantyMutation 
} from "@/components/store/api/regularWarranty/regularWarrantyApi";
import AddEditRegularWarrantyModal from "./AddEditRegularWarrantyModal";

const RegularWarranty = () => {
  const [searchRegularWarranty, setSearchRegularWarranty] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const [currentRegularWarranty, setCurrentRegularWarranty] = useState<{ id: number | null; name: string;info?:string } | undefined>(undefined);
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

  const { data, isLoading, isError, refetch } = useGetRegularWarrantiesQuery({
    page: pagination.page,
    size: pagination.size,
    search: searchRegularWarranty,
  });

  const [addRegularWarranty, { isLoading: addLoading, error: addError }] = useAddRegularWarrantyMutation();
  const [updateRegularWarranty, { isLoading: editLoading, error: editError }] = useUpdateRegularWarrantyMutation();
  const [deleteRegularWarranty, { isLoading: deleteLoading, error: deleteError }] = useDeleteRegularWarrantyMutation();

  const regularWarranties = data?.data || [];

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

  const handleRowSelect = (warranty: any) => {
    setSelectedRows((prev) =>
      prev.some((selected) => selected.id === warranty.id)
        ? prev.filter((selected) => selected.id !== warranty.id)
        : [...prev, warranty]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === regularWarranties.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...regularWarranties]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      if (selectedRows.length === 0) {
        toast({
          title: "No Items Selected",
          description: "Please select at least one item to delete.",
          variant: "destructive",
        });
        return;
      }

      const deletePromises = selectedRows.map(warranty => 
        deleteRegularWarranty(warranty.id).unwrap()
      );
      await Promise.all(deletePromises);

      toast({
        title: "Success",
        description: "Selected warranties have been deleted successfully",
      });

      setSelectedRows([]);
      refetch();
    } catch (err) {
        console.error(err)
      toast({
        title: "Error",
        description: "Failed to delete selected warranties",
        variant: "destructive",
      });
    }
  };

  const handleSaveRegularWarranty = async (id: number | null, name: string, info?:string) => {
    try {
      const data={name, info}
      const result = id
        ? await updateRegularWarranty({ id, data:data }).unwrap()
        : await addRegularWarranty({ name, info }).unwrap();

      if (result.success) {
        toast({
          title: id ? "Update Regular Warranty" : "Add Regular Warranty",
          description: toastMessageGenerator(id ? "update" : "add", "RegularWarranty"),
        });
        setModalOpen(false);
        refetch();
      }
    } catch (err) {
      console.error("Error saving RegularWarranty:", err);
    }
  };

  const handleDeleteRegularWarranty = async (id: number) => {
    try {
      await deleteRegularWarranty(id).unwrap();
      toast({ 
        title: "Regular Warranty deleted successfully", 
        description: "The warranty has been deleted." 
      });
      refetch();
    } catch (err) {
      console.error("Error deleting Regular Warranty:", err);
    }
  };

  const handleAddRegularWarranty = () => {
    setCurrentRegularWarranty(undefined);
    setModalOpen(true);
  };

  const handleEditRegularWarranty = (warranty: any) => {
    setCurrentRegularWarranty(warranty);
    setModalOpen(true);
  };

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Regular Warranty</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">
              Export
            </button>
            <button
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddRegularWarranty}
            >
              <Plus className="font-bold w-4 h-4" /> Add Regular Warranty
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center bg-white px-4 rounded-lg">
          <div className="relative w-1/3 my-4">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded pl-10 pr-3 py-1 text-gray-700 w-60"
              value={searchRegularWarranty}
              onChange={(e) => setSearchRegularWarranty(e.target.value)}
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
        {isError && (
          <div className="text-center py-6 text-red-500">
            Failed to fetch Regular Warranties.
          </div>
        )}

        {!isLoading && !isError && (
          <Table
            headers={["SL", "Regular Warranty", "Info", "Actions"]}
            data={regularWarranties}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
            renderRow={(row, index: number) => {
              const dynamicIndex = index + 1 + (pagination.page - 1) * pagination.size;
              return (
                <>
                  <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                  <td className="px-4 py-2 font-medium">{row.name}</td>
                  <td className="px-4 py-2 font-medium">{row?.info}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditRegularWarranty(row)}
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
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteRegularWarranty(row.id)}
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

        <AddEditRegularWarrantyModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveRegularWarranty}
          currentRegularWarranty={currentRegularWarranty}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default RegularWarranty;