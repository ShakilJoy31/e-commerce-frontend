import PageWrapper from "@/components/common/wrapper/PageWrapper";
import Table from "@/components/ui/table";
import { AlertCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import AddEditWhatsAppModal from "./AddEditWhatsAppModal";
import {
  useAddWhatsAppMutation,
  useDeleteWhatsAppMutation,
  useGetWhatsAppContactsQuery,
  useUpdateWhatsAppMutation,
} from "@/components/store/api/whatsApp/whatsAppApi";
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

const WhatsAppList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const [currentWhatsApp, setCurrentWhatsApp] = useState<
    { id: number | null; number: string } | undefined
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
  const { data, isLoading, isError, refetch } = useGetWhatsAppContactsQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });
  const [addWhatsApp, {isLoading:addLoading, error:addError}] = useAddWhatsAppMutation();
  const [updateWhatsApp, {isLoading:editLoading, error:editError}] = useUpdateWhatsAppMutation();
  const [deleteWhatsApp, { isLoading: deleteLoading, error: deleteError }] = useDeleteWhatsAppMutation();

  // WhatsApp List
  const whatsApps = data?.data || [];
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

  const handleSaveWhatsApp = async (id: number | null, number: string) => {
    try {
      if (id) {
        if (number && !number.startsWith("88")) {
          number = `88${number}`;
        }
        // Update WhatsApp Contact
       const result= await updateWhatsApp({ id, data: { number } }).unwrap();
       if (result.success) {
        toast({
          title: "Update Whatsapp Message",
          description: toastMessageGenerator("update", "whatsapp"),
        });
        setModalOpen(false);
      }
      } else {
        if (number && !number.startsWith("88")) {
          number = `88${number}`;
        }
        // Add WhatsApp Contact
       const result= await addWhatsApp({ number }).unwrap();
       if (result.success) {
        toast({
          title: "Add Whatsapp Message",
          description: toastMessageGenerator("add", "whatsapp"),
        });
        setModalOpen(false);
      }
      }
      refetch(); 
    } catch (err) {
      console.error("Error saving WhatsApp contact:", err);
    }
  };

  const handleDeleteWhatsApp = async (id: number) => {
    try {
      await deleteWhatsApp(id).unwrap();
      toast({
        title: "Whatsapp deleted successfully",
        description: "The whatsapp has been deleted.",
      });
      refetch(); // Refresh the WhatsApp list
    } catch (err) {
      console.error("Error deleting WhatsApp contact:", err);
    }
  };

  const handleAddWhatsApp = () => {
    setCurrentWhatsApp(undefined);
    setModalOpen(true);
  };

  const handleEditWhatsApp = (whatsapp: any) => {
    setCurrentWhatsApp(whatsapp);
    setModalOpen(true);
  };

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">WhatsApp Contacts</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">
              Export
            </button>
            <button
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddWhatsApp}
            >
              <Plus className="font-bold w-4 h-4" /> Add WhatsApp Contact
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
        {isLoading && (
          <LoaderSpinner/>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-6 text-red-500">
            Failed to fetch WhatsApp contacts.
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <Table
            headers={["SL", "Phone Number", ]}
            data={whatsApps}
            selectedRows={selectedRows}
            onRowSelect={(id) => {
              setSelectedRows((prev) =>
                prev.includes(id)
                  ? prev.filter((rowId) => rowId !== id)
                  : [...prev, id]
              );
            }}
            onSelectAll={() => {
              if (selectedRows.length === whatsApps.length) {
                setSelectedRows([]);
              } else {
                setSelectedRows(whatsApps.map((whatsapp) => whatsapp.id));
              }
            }}
            renderRow={(row, index:number) =>{
              const dynamicIndex = index + 1 + (pagination.page - 1) * pagination.size;
              return( <>
                <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                <td className="px-4 py-2 font-medium">{row.number}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEditWhatsApp(row)}
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
                            onClick={() => handleDeleteWhatsApp(row.id)}
                          >
                            {deleteLoading && <ButtonLoader />} Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </td>
              </>)
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
        <AddEditWhatsAppModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveWhatsApp}
          currentWhatsApp={currentWhatsApp}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default WhatsAppList;
