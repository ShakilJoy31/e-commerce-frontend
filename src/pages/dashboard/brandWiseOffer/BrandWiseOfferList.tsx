import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { AlertCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import Table from "@/components/ui/table";
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
import AddEditBrandOfferModal from "./AddEditBrandOfferModal";
import { 
  useAddBrandOfferMutation, 
  useDeleteBrandOfferMutation, 
  useGetBrandOffersQuery, 
  useUpdateBrandOfferMutation 
} from "@/components/store/api/brandOffer/brandOfferApi";

// Define the Offer type
export type Offer = {
  id?: number | null;
  tagId: number;
  offerId: number;
};

const BrandWiseOfferList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<Offer | undefined>(undefined);
  const { toast } = useToast();
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
  const { 
    data, 
    isLoading, 
    isError, 
    refetch 
  } = useGetBrandOffersQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });

  const [addOffer, { isLoading: addLoading, error: addError }] = useAddBrandOfferMutation();
  const [updateOffer, { isLoading: editLoading, error: editError }] = useUpdateBrandOfferMutation();
  const [deleteOffer, { isLoading: deleteLoading, error: deleteError }] = useDeleteBrandOfferMutation();

  // Offer List
  const offers = data?.data || [];

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

  const handleSaveOffer = async (offerData: { tagId: number; offerId: number }) => {
    try {
      if (currentOffer?.id) {
        // Update existing offer
        await updateOffer({
          id: currentOffer.id,
          data: offerData
        }).unwrap();
        toast({
          title: "Success",
          description: toastMessageGenerator("update", "brand offer"),
        });
      } else {
        // Add new offer
        await addOffer(offerData).unwrap();
        toast({
          title: "Success",
          description: toastMessageGenerator("add", "brand offer"),
        });
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Error saving brand offer:", err);
      toast({
        title: "Error",
        description: "Failed to save brand offer",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOffer = async (id: number) => {
    try {
      await deleteOffer(id).unwrap();
      toast({
        title: "Success",
        description: toastMessageGenerator("delete", "brand offer"),
      });
      refetch();
    } catch (err) {
      console.error("Error deleting brand offer:", err);
      toast({
        title: "Error",
        description: "Failed to delete brand offer",
        variant: "destructive",
      });
    }
  };

  const handleAddOffer = () => {
    setCurrentOffer({
      id: null,
      tagId: 0,
      offerId: 0
    });
    setModalOpen(true);
  };

  const handleEditOffer = (offer: any) => {
    setCurrentOffer({
      id: offer.id,
      tagId: offer.tagId,
      offerId: offer.offerId
    });
    setModalOpen(true);
  };

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Tags Offers</h1>
          <div className="flex items-center gap-2">
            <button
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddOffer}
            >
              <Plus className="font-bold w-4 h-4" /> Add Offer
            </button>
          </div>
        </div>

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

        {isLoading && <LoaderSpinner />}
        {isError && (
          <div className="text-center py-6 text-red-500">
            Failed to fetch brand offers.
          </div>
        )}

        {!isLoading && !isError && (
          <Table
            headers={[
              "SL",
              "Tag Name",
              "Offer Name",
              "Action"
            ]}
            data={offers}
            renderRow={(row: any, index: number) => {
              const dynamicIndex = index + 1 + (pagination.page - 1) * pagination.size;
              return (
                <>
                  <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                  <td className="px-4 py-2 font-medium">{row.tag.name}</td>
                  <td className="px-4 py-2">{row.offer?.offerName}</td>
                  <td className="px-4 py-2 flex justify-center items-center gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditOffer(row)}
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
                            This action cannot be undone. This will permanently delete the brand offer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="btn-destructive-fill">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteOffer(row.id!)}
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
            selectedRows={undefined}
            onRowSelect={undefined}
            onSelectAll={undefined}
          />
        )}

        {deleteError && "data" in deleteError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
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

        <AddEditBrandOfferModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveOffer}
          currentOffer={currentOffer}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default BrandWiseOfferList;