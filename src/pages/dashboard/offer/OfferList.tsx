import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { AlertCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import {
  useDeleteOfferMutation,
  useGetAllOffersQuery,
} from "@/components/store/api/products/offerApi";
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
import { Link } from "react-router-dom";

// Define the Offer type
export type Offer = {
  id: number | undefined;
  offerId?: number | null;
  offerName: string;
  subTitle?: string;
  link:string;
  discountType: "FIXED" | "PERCENTAGE";
  offerType: "Online" | "Outlet";
  discount: number;
  image: string;
  startingDate: string;
  startingTime: string;
  expiryDate: string;
  expiryTime: string;
  description?: string;
  condition?: string;
};

const OfferList = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
  const { data, isLoading, isError, refetch } = useGetAllOffersQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });

  const [deleteOffer, { isLoading: deleteLoading, error: deleteError }] =
    useDeleteOfferMutation();

  // Offer List
  const offers =
    data?.data.map((offer: Partial<Offer>) => ({
      id: offer.id,
      link:offer?.link,
      offerName: offer.offerName || "",
      subTitle: offer.subTitle || "",
      discountType: offer.discountType || "FIXED",
      offerType: offer.offerType || "Online",
      discount: offer.discount || 0,
      image: offer.image || "",
      startingDate: offer.startingDate || "",
      startingTime: offer.startingTime || "",
      expiryDate: offer.expiryDate || "",
      expiryTime: offer.expiryTime || "",
      description: offer.description || "",
      condition: offer.condition || "",
    })) || [];

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

  const handleDeleteOffer = async (id: number) => {
    try {
      await deleteOffer(id).unwrap();
      toast({
        title: "Delete Offer Message",
        description: toastMessageGenerator("delete", "offer"),
      });
      refetch();
    } catch (err) {
      console.error("Error deleting offer:", err);
    }
  };

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Offers</h1>
          <div className="flex items-center gap-2">
            <Link to={"/kry-admin-portal/create-offer"}>
              <button className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">
                <Plus className="font-bold w-4 h-4" /> Add Offer
              </button>
            </Link>
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
            Failed to fetch offers.
          </div>
        )}

        {!isLoading && !isError && (
          <Table
            headers={[
              "SL",
              "Offer Name",
              "Discount Type",
              "Offer Type",
              "Discount",
              "Action",
            ]}
            data={offers}
            renderRow={(row: Offer, index: number) => {
           
              const dynamicIndex =
                index + 1 + (pagination.page - 1) * pagination.size;
              return (
                <>
                  <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                  <td className="px-4 py-2 font-medium">{row.offerName}</td>
                  <td className="px-4 py-2">{row.discountType}</td>
                  <td className="px-4 py-2">{row.offerType}</td>
                  <td className="px-4 py-2">{row.discount}</td>
                  <td className="px-4 py-2 flex justify-center items-center gap-2 mx-auto">
                    <Link to={`/kry-admin-portal/edit-offer/${row?.link}`}>
                      <button className="text-blue-600 hover:text-blue-800">
                        <FiEdit />
                      </button>
                    </Link>
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
      </div>
    </PageWrapper>
  );
};

export default OfferList;
