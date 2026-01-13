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
import {
  useAddGiftMutation,
  useDeleteGiftMutation,
  useGetGiftsQuery,
  useUpdateGiftMutation,
} from "@/components/store/api/gift/giftApi";
import AddEditGiftModal from "./AddEditGiftModal";

const GiftList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const [currentGift, setCurrentGift] = useState<
    | { id: number | null; name: string; image: string; quantity: number }
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

  const { data, isLoading, isError, refetch } = useGetGiftsQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });

  const [addGift, { isLoading: addLoading, error: addError }] =
    useAddGiftMutation();
  const [updateGift, { isLoading: editLoading, error: editError }] =
    useUpdateGiftMutation();
  const [deleteGift, { isLoading: deleteLoading, error: deleteError }] =
    useDeleteGiftMutation();

  const gifts = data?.data || [];

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
  const handleSaveGift = async (
    id: number | null,
    name: string,
    image: string,
    quantity: number
  ) => {
    try {
      if (id) {
        const result = await updateGift({
          id,
          data: { name, image, quantity },
        }).unwrap();
        if (result.success) {
          toast({
            title: "Update Gift Message",
            description: toastMessageGenerator("update", "gift"),
          });
          setModalOpen(false);
        }
      } else {
        const result = await addGift({ name, image, quantity }).unwrap();
        if (result.success) {
          toast({
            title: "Add Gift Message",
            description: toastMessageGenerator("add", "gift"),
          });
          setModalOpen(false);
        }
      }
      refetch();
    } catch (err) {
      console.error("Error saving gift:", err);
    }
  };

  const handleDeleteGift = async (id: number) => {
    try {
      await deleteGift(id).unwrap();
      toast({
        title: "Gift deleted successfully",
        description: "The gift has been deleted.",
      });
      refetch();
    } catch (err) {
      console.error("Error deleting gift:", err);
    }
  };

  const handleAddGift = () => {
    setCurrentGift(undefined);
    setModalOpen(true);
  };

  const handleEditGift = (gift: any) => {
    setCurrentGift(gift);
    setModalOpen(true);
  };
  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Gifts</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">
              Export
            </button>
            <button
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddGift}
            >
              <Plus className="font-bold w-4 h-4" /> Add Gift
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
            Failed to fetch vendor.
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <Table
            headers={["SL", "Gift Name", "Image", "Quantity", "Action"]}
            data={gifts}
            selectedRows={selectedRows}
            onRowSelect={(id) => {
              setSelectedRows((prev) =>
                prev.includes(id)
                  ? prev.filter((rowId) => rowId !== id)
                  : [...prev, id]
              );
            }}
            onSelectAll={() => {
              if (selectedRows.length === gifts.length) {
                setSelectedRows([]);
              } else {
                setSelectedRows(gifts.map((gift) => gift.id));
              }
            }}
            renderRow={(row, index: number) => {
              const dynamicIndex =
                index + 1 + (pagination.page - 1) * pagination.size;
              return (
                <>
                  <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                  <td className="px-4 py-2 font-medium">{row.name}</td>
                  <td className="px-4 py-2 font-medium mx-auto text-center flex justify-center">
                    <img
                      src={row.image}
                      alt={row.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">{row.quantity}</td>
                  <td className="px-4 py-2 flex gap-2 mx-auto  justify-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditGift(row)}
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
                            onClick={() => handleDeleteGift(row.id)}
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
            <AlertTitle>Gift Error</AlertTitle>
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
        <AddEditGiftModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveGift}
          currentGift={currentGift}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default GiftList;
