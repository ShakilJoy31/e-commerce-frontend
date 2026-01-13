import PageWrapper from "@/components/common/wrapper/PageWrapper";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
  useAddBankMutation,
  useDeleteBankMutation,
  useGetBanksQuery,
  useUpdateBankMutation,
} from "@/components/store/api/emi/bankApi";
import Table from "@/components/ui/table";
import { AlertCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import AddEditBankModal from "./AddEditBankModal";
import Pagination from "@/components/ui/pagination";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
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
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import ButtonLoader from "@/components/loader/ButtonLoader";

const BankList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentBank, setCurrentBank] = useState<
    { id: number | null; name: string; accountNumber: string } | undefined
  >(undefined);
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
  const { data, isLoading, isError, refetch } = useGetBanksQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });
  const [addBank, { isLoading: addLoading, error: addError }] =
    useAddBankMutation();
  const [updateBank, { isLoading: editLoading, error: editError }] =
    useUpdateBankMutation();
  const [deleteBank, { isLoading: deleteLoading, error: deleteError }] =
    useDeleteBankMutation();

  // Bank List
  const banks = data?.data || [];
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
  const handleSaveBank = async (id: number | null, name: string) => {
    try {
      if (id) {
        const bankData = {
          name: name,
        };
        // Update Bank
        const result = await updateBank({ id, data: bankData }).unwrap();
        if (result.success) {
          toast({
            title: "Update Bank Message",
            description: toastMessageGenerator("update", "bank"),
          });
          setModalOpen(false);
        }
      } else {
        const bankData = {
          name: name,
        };
        // Add Bank
        const result = await addBank(bankData).unwrap();
        if (result.success) {
          toast({
            title: "Add Bank Message",
            description: toastMessageGenerator("add", "bank"),
          });
          setModalOpen(false);
        }
      }
      refetch();
    } catch (err) {
      console.error("Error saving bank:", err);
    }
  };

  const handleDeleteBank = async (id: number) => {
    try {
      await deleteBank(id).unwrap();
      toast({
        title: "Bank deleted successfully",
        description: "The bank has been deleted.",
      });
      refetch(); // Refresh the bank list
    } catch (err) {
      console.error("Error deleting bank:", err);
    }
  };

  const handleAddBank = () => {
    setCurrentBank(undefined);
    setModalOpen(true);
  };

  const handleEditBank = (bank: any) => {
    setCurrentBank(bank);
    setModalOpen(true);
  };

  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === banks.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(banks.map((bank) => bank.id));
    }
  };

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Banks</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">
              Export
            </button>
            <button
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddBank}
            >
              <Plus className="font-bold w-4 h-4" /> Add Bank
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
            Failed to fetch banks.
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <Table
  headers={["SL", "Bank Name", "Action"]}
  data={banks}
  selectedRows={selectedRows}
  onRowSelect={handleRowSelect}
  onSelectAll={handleSelectAll}
  renderRow={(row, index: number) => {
    const dynamicIndex = index + 1 + (pagination.page - 1) * pagination.size;
    return (
      <>
        <td className="px-4 py-2 text-center">{dynamicIndex}</td>
        <td className="px-4 py-2">{row.name}</td>
        <td className="px-4 py-2 text-center">
          <div className="flex justify-center gap-2">
            <button
              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
              onClick={() => handleEditBank(row)}
            >
              <FiEdit className="w-4 h-4" />
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50">
                  <FiTrash2 className="w-4 h-4" />
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
                    onClick={() => handleDeleteBank(row.id)}
                  >
                    {deleteLoading && <ButtonLoader />} Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </td>
      </>
    );
  }}
/>
        )}

        {deleteError && "data" in deleteError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Color Error</AlertTitle>
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
        <AddEditBankModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveBank}
          currentBank={currentBank}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default BankList;
