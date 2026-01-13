import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  useAddRamMutation,
  useDeleteRamMutation,
  useGetRamsQuery,
  useUpdateRamMutation,
} from "@/components/store/api/ram/ramApi";
import Table from "@/components/ui/table";
import { AlertCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import AddEditRamModal from "./AddEditRamModal";
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
const RamList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const [currentRam, setCurrentRam] = useState<
    { id: number | null; ram: string } | undefined
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
  const { data, isLoading, isError, refetch } = useGetRamsQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });
  const [addRam, {isLoading:addLoading, error:addError}] = useAddRamMutation();
  const [updateRam, {isLoading:editLoading, error:editError}] = useUpdateRamMutation();
  const [deleteRam, { isLoading: deleteLoading, error: deleteError }] = useDeleteRamMutation();

  // Size List
  const rams = data?.data || [];
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

  const handleSaveRam = async (id: number | null, ram: string) => {
    try {
      if (id) {
        // Update Size
      const result=  await updateRam({ id, data: { ram } }).unwrap();
      if (result.success) {
        toast({
          title: "Update Ram Message",
          description: toastMessageGenerator("update", "ram"),
        });
        setModalOpen(false);
      }
      } else {
        // Add Size
       const result= await addRam({ ram }).unwrap();
       if (result.success) {
        toast({
          title: "Add Ram Message",
          description: toastMessageGenerator("add", "ram"),
        });
        setModalOpen(false);
      }
      }
      refetch(); 
    } catch (err) {
      console.error("Error saving ram:", err);
    }
  };

  const handleDeleteRam = async (id: number) => {
    try {
      await deleteRam(id).unwrap();
      toast({
        title: "Ram deleted successfully",
        description: "The ram has been deleted.",
      });
      refetch(); // Refresh the size list
    } catch (err) {
      console.error("Error deleting ram:", err);
    }
  };

  const handleAddRam = () => {
    setCurrentRam(undefined);
    setModalOpen(true);
  };

  const handleEditSize = (size: any) => {
    setCurrentRam(size);
    setModalOpen(true);
  };

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Rams</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">
              Export
            </button>
            <button
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddRam}
            >
              <Plus className="font-bold w-4 h-4" /> Add Ram
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
            Failed to fetch ram.
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <Table
            headers={["SL", "Ram", "Action" ]}
            data={rams}
            selectedRows={selectedRows}
            onRowSelect={(id) => {
              setSelectedRows((prev) =>
                prev.includes(id)
                  ? prev.filter((rowId) => rowId !== id)
                  : [...prev, id]
              );
            }}
            onSelectAll={() => {
              if (selectedRows.length === rams.length) {
                setSelectedRows([]);
              } else {
                setSelectedRows(rams.map((ram) => ram.id));
              }
            }}
            renderRow={(row, index: number) => {
              const dynamicIndex =
                index + 1 + (pagination.page - 1) * pagination.size;
              return (
                <>
                  <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                  <td className="px-4 py-2 font-medium">{row.ram}</td>
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
                            onClick={() => handleDeleteRam(row.id)}
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
            <AlertTitle>Ram Error</AlertTitle>
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
        <AddEditRamModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveRam}
          currentRam={currentRam}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default RamList;
