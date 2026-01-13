import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  useAddEmiMutation,
  useDeleteEmiMutation,
  useGetEmisQuery,
  useUpdateEmiMutation,
} from "@/components/store/api/emi/emiApi";
import Table from "@/components/ui/table";
import { AlertCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import AddEditEmiModal from "./AddEditEmiModal";
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
import LoaderSpinner from "@/components/loader/LoaderSpinner";

const EmiList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const [currentEmi, setCurrentEmi] = useState<
    | { id: number | null; bankId: number; month: number; charge: number }
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
  const { data, isLoading, isError, refetch } = useGetEmisQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });
  const [addEmi, { isLoading: addLoading, error: addError }] =
    useAddEmiMutation();
  const [updateEmi, { isLoading: editLoading, error: editError }] =
    useUpdateEmiMutation();
  const [deleteEmi, { isLoading: deleteLoading, error: deleteError }] =
    useDeleteEmiMutation();

  const emiList = data?.data || [];
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

  const handleSaveEmi = async (payload: {
    id: number | null;
    bankId: number;
    month: number;
    charge: number;
  }) => {
    try {
      if (payload.id) {
        // Update EMI
        const result = await updateEmi({
          id: payload.id,
          data: {
            bankId: payload.bankId,
            month: payload.month,
            charge: payload.charge,
          },
        }).unwrap();

        if (result.success) {
          toast({
            title: "Update Emi Message",
            description: toastMessageGenerator("update", "emi"),
          });
          setModalOpen(false);
        }
      } else {
        // Add EMI
        const result = await addEmi({
          bankId: payload.bankId,
          month: payload.month,
          charge: payload.charge,
        }).unwrap();
        if (result.success) {
          toast({
            title: "Add Emi Message",
            description: toastMessageGenerator("add", "emi"),
          });
          setModalOpen(false);
        }
      }
      refetch();
    } catch (err) {
      console.error("Error saving EMI:", err);
    }
  };

  const handleDeleteEmi = async (id: number) => {
    try {
      await deleteEmi(id).unwrap();
      toast({
        title: "Emi deleted successfully",
        description: "The emi has been deleted.",
      });
      refetch();
    } catch (err) {
      console.error("Error deleting EMI:", err);
    }
  };

  const handleAddEmi = () => {
    setCurrentEmi(undefined);
    setModalOpen(true);
  };

  const handleEditEmi = (emi: any) => {
    setCurrentEmi(emi);
    setModalOpen(true);
  };

  if (isLoading) {
    return <LoaderSpinner />;
  }

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">EMI Plans</h1>
          <button
            className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            onClick={handleAddEmi}
          >
            <Plus className="font-bold w-4 h-4" /> Add EMI Plan
          </button>
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

        {isError && (
          <div className="text-center py-6 text-red-500">
            Failed to fetch EMI plans.
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <Table
            headers={["SL", "Bank", "Months", "Charge (%)", "Action"]}
            data={emiList}
            selectedRows={selectedRows}
            onRowSelect={(id: any) => {
              setSelectedRows((prev) =>
                prev.includes(id)
                  ? prev.filter((rowId) => rowId !== id)
                  : [...prev, id]
              );
            }}
            onSelectAll={() => {
              if (selectedRows.length === emiList.length) {
                setSelectedRows([]);
              } else {
                setSelectedRows(emiList.map((emi) => emi.id));
              }
            }}
            renderRow={(row: any, index: number) => {
              const dynamicIndex =
                index + 1 + (pagination.page - 1) * pagination.size;
              return (
                <>
                  <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                  <td className="px-4 py-2 font-medium">{row?.bank?.name}</td>
                  <td className="px-4 py-2">{row.month}</td>
                  <td className="px-4 py-2">{row.charge}%</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditEmi(row)}
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
                            onClick={() => handleDeleteEmi(row.id)}
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
            <AlertTitle>Emi Error</AlertTitle>
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
        <AddEditEmiModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveEmi}
          currentEmi={currentEmi}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default EmiList;
