import PageWrapper from "@/components/common/wrapper/PageWrapper";
import LoaderSpinner from "@/components/loader/LoaderSpinner";

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
import Pagination from "@/components/ui/pagination";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { useAddConditionMutation, useDeleteConditionMutation, useGetConditionsQuery, useUpdateConditionMutation } from "@/components/store/api/condition/conditionApi";
import AddEditConditionModal from "./AddEditConditionModal";

const ConditionList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentCondition, setCurrentCondition] = useState<
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
  const { data, isLoading, isError, refetch } = useGetConditionsQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });
  const [addCondition, { isLoading: addLoading, error: addError }] =
    useAddConditionMutation();
  const [updateCondition, { isLoading: editLoading, error: editError }] =
    useUpdateConditionMutation();
  const [deleteCondition, { isLoading: deleteLoading, error: deleteError }] =
    useDeleteConditionMutation();

  // condition List
  const conditions = data?.data || [];

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

  const handleSaveCondition = async (id: number | null, name: string) => {
    try {
      if (id) {
        const result = await updateCondition({ id, data: { name } }).unwrap();
        if (result.success) {
          toast({
            title: "Update Condition Message",
            description: toastMessageGenerator("update", "condition"),
          });
          setModalOpen(false);
        }
      } else {
        const result = await addCondition({ name }).unwrap();
        if (result.success) {
          toast({
            title: "Add Condition Message",
            description: toastMessageGenerator("add", "condition"),
          });
          setModalOpen(false);
        }
      }
      refetch();
    } catch (err) {
      toast({ title: "Error saving condtion.", variant: "destructive" });
      console.error("Error saving condition:", err);
    }
  };

  const handleDeleteCondition = async (id: number) => {
    try {
      await deleteCondition(id).unwrap();
      toast({ title: "Condition deleted successfully!", variant: "default" });
      refetch();
    } catch (err) {
      toast({ title: "Error deleting condition.", variant: "destructive" });
      console.error("Error deleting condition:", err);
    }
  };

  const handleAddCondition = () => {
    setCurrentCondition(undefined);
    setModalOpen(true);
  };

  const handleEditCondition = (condition: any) => {
    setCurrentCondition(condition);
    setModalOpen(true);
  };

  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === conditions.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(conditions.map((condition) => condition.id));
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
          <h1 className="text-2xl font-semibold">Conditions</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">
              Export
            </button>
            <button
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddCondition}
            >
              <Plus className="font-bold w-4 h-4" /> Add Condition
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
            Failed to fetch conditions.
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <Table
            headers={["SL", "Condition", "Action"]}
            data={conditions}
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
                      onClick={() => handleEditCondition(row)}
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
                            onClick={() => handleDeleteCondition(row.id)}
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
            <AlertTitle>Condition Error</AlertTitle>
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
        <AddEditConditionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveCondition}
          currentCondition={currentCondition}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default ConditionList;
