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
import AddEditSectionModal from "./AddEditSectionModal";
import { 
  useAddSectionMutation, 
  useDeleteSectionMutation, 
  useGetSectionsQuery, 
  useUpdateSectionMutation 
} from "@/components/store/api/section/sectionApi";

interface Section {
  id: number;
  name: string;
  seeMore?: string;
}

const Section = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState<Section | undefined>(undefined);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [pagination, setPagination] = useState({
    sort: "asc",
    page: 1,
    size: 10,
    meta: {
      page: null as number | null,
      size: null as number | null,
      total: null as number | null,
      totalPage: null as number | null,
    },
  });

  // API Calls
  const { data, isLoading, isError, refetch } = useGetSectionsQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });
  
  const [addSection, { isLoading: addLoading, error: addError }] = useAddSectionMutation();
  const [updateSection, { isLoading: editLoading, error: editError }] = useUpdateSectionMutation();
  const [deleteSection, { isLoading: deleteLoading }] = useDeleteSectionMutation();

  const sections = data?.data || [];

  useEffect(() => {
    if (data) {
      setPagination(prev => ({
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
    setPagination(prev => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination(prev => ({
      ...prev,
      size: itemsPerPage,
      page: 1,
    }));
  };

  const handleSaveSection = async (id: number | null, name: string, seeMore: string) => {
    try {
      if (id) {
        // Update Section
        const result = await updateSection({ id, data: { name, seeMore  } }).unwrap();
        if (result.success) {
          toast({
            title: "Success",
            description: toastMessageGenerator("update", "section"),
          });
          setModalOpen(false);
        }
      } else {
        // Add Section
        const result = await addSection({ name, seeMore  }).unwrap();
        if (result.success) {
          toast({
            title: "Success",
            description: toastMessageGenerator("add", "section"),
          });
          setModalOpen(false);
        }
      }
      refetch();
    } catch (err) {
      console.error("Error saving section:", err);
      toast({
        title: "Error",
        description: "Failed to save section. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSection = async (id: number) => {
    try {
      await deleteSection(id).unwrap();
      toast({
        title: "Success",
        description: "Section deleted successfully",
      });
      refetch();
    } catch (err) {
      console.error("Error deleting section:", err);
      toast({
        title: "Error",
        description: "Failed to delete section. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddSection = () => {
    setCurrentSection(undefined);
    setModalOpen(true);
  };

  const handleEditSection = (section: Section) => {
    setCurrentSection(section);
    setModalOpen(true);
  };

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen p-4">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Sections</h1>
          <div className="flex items-center gap-2">
            <button 
              className="px-4 py-1 font-semibold rounded border text-blue-500 hover:bg-blue-50 transition-colors"
              onClick={() => {/* Export functionality */}}
            >
              Export
            </button>
            <button
              className="px-4 flex items-center gap-2 py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors"
              onClick={handleAddSection}
            >
              <Plus className="w-4 h-4" /> Add Section
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search sections..."
              className="block w-full pl-10 pr-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <LoaderSpinner />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to fetch sections. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table
                headers={["SL", "Section Name", "Link", "Action"]}
                data={sections}
                selectedRows={selectedRows}
                onRowSelect={(id) => {
                  setSelectedRows(prev =>
                    prev.includes(id)
                      ? prev.filter(rowId => rowId !== id)
                      : [...prev, id]
                  );
                }}
                onSelectAll={() => {
                  setSelectedRows(prev =>
                    prev.length === sections.length
                      ? []
                      : sections.map(section => section.id)
                  );
                }}
                renderRow={(row: Section, index: number) => {
                  const dynamicIndex = index + 1 + (pagination.page - 1) * pagination.size;
                  return (
                    <>
                      <td className="px-4 py-3">{dynamicIndex}</td>
                      <td className="px-4 py-3">{row.name}</td>
                      <td className="px-4 py-3 text-blue-500 hover:underline">
                        {row.seeMore || "-"}
                      </td>
                      <td className="px-4 py-3 flex gap-2 justify-center">
                        <button
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          onClick={() => handleEditSection(row)}
                        >
                          <FiEdit />
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50">
                              <FiTrash2 />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this section? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteSection(row.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {deleteLoading ? <ButtonLoader /> : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </>
                  );
                }}
              />
            </div>

            <div className="mt-6">
              <Pagination
                totalPages={pagination.meta.totalPage || 1}
                currentPage={pagination.page}
                itemsPerPage={pagination.size}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </>
        )}

        {/* Add/Edit Modal */}
        <AddEditSectionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveSection}
          currentSection={currentSection}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default Section;