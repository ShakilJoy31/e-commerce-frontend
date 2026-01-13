import PageWrapper from "@/components/common/wrapper/PageWrapper";

import Table from "@/components/ui/table";
import { AlertCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import AddEditHighlightTextModal from "./AddEditHighligtTextModal";
import {
  useAddHighlightTextMutation,
  useDeleteHighlightTextMutation,
  useGetHighlightTextsQuery,
  useUpdateHighlightTextMutation,
} from "@/components/store/api/highlightText/highlightTextApi";
import Pagination from "@/components/ui/pagination";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
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

const HighlightTextList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentHighlightText, setCurrentHighlightText] = useState<
    { id: number | null; text: string } | undefined
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
  const { data, isLoading, isError, refetch } = useGetHighlightTextsQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });
  const [addHighlightText, { isLoading: addLoading, error: addError }] =
    useAddHighlightTextMutation();
  const [updateHighlightText, { isLoading: editLoading, error: editError }] =
    useUpdateHighlightTextMutation();
  const [
    deleteHighlightText,
    { isLoading: deleteLoading, error: deleteError },
  ] = useDeleteHighlightTextMutation();

  // Highlight Text List
  const highlightTexts = data?.data || [];
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

  const handleSaveHighlightText = async (id: number | null, text: string) => {
    try {
      if (id) {
        // Update Highlight Text
        const result = await updateHighlightText({
          id,
          data: { text },
        }).unwrap();
        if (result.success) {
          toast({
            title: "Update Highlighttext Message",
            description: toastMessageGenerator("update", "hightlight"),
          });
          setModalOpen(false);
        }
      } else {
        // Add Highlight Text
        const result = await addHighlightText({ text }).unwrap();
        if (result.success) {
          toast({
            title: "Add Highlightext Message",
            description: toastMessageGenerator("add", "highlight"),
          });
          setModalOpen(false);
        }
      }
      refetch();
    } catch (err) {
      console.error("Error saving highlight text:", err);
    }
  };

  const handleDeleteHighlightText = async (id: number) => {
    try {
      await deleteHighlightText(id).unwrap();
      toast({
        title: "Highlight Text deleted successfully",
        description: "The highlight has been deleted.",
      });
      refetch(); // Refresh the highlight text list
    } catch (err) {
      console.error("Error deleting highlight text:", err);
    }
  };

  const handleAddHighlightText = () => {
    setCurrentHighlightText(undefined);
    setModalOpen(true);
  };

  const handleEditHighlightText = (highlightText: any) => {
    setCurrentHighlightText(highlightText);
    setModalOpen(true);
  };

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Highlight Texts</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">
              Export
            </button>
            <button
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddHighlightText}
            >
              <Plus className="font-bold w-4 h-4" /> Add Highlight Text
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
            Failed to fetch highlight texts.
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <Table
            headers={["SL", "Text", "Action"]}
            data={highlightTexts}
            selectedRows={selectedRows}
            onRowSelect={(id) => {
              setSelectedRows((prev) =>
                prev.includes(id)
                  ? prev.filter((rowId) => rowId !== id)
                  : [...prev, id]
              );
            }}
            onSelectAll={() => {
              if (selectedRows.length === highlightTexts.length) {
                setSelectedRows([]);
              } else {
                setSelectedRows(highlightTexts.map((text) => text.id));
              }
            }}
            renderRow={(row, index: number) => {
              const dynamicIndex =
                index + 1 + (pagination.page - 1) * pagination.size;
              return (
                <>
                  <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                  <td className="px-4 py-2 font-medium">{row.text}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditHighlightText(row)}
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
                            onClick={() => handleDeleteHighlightText(row.id)}
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
        <AddEditHighlightTextModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveHighlightText}
          currentHighlightText={currentHighlightText}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default HighlightTextList;
