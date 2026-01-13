/* eslint-disable @typescript-eslint/ban-ts-comment */
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  useAddBannerMutation,
  useDeleteBannerMutation,
  useGetBannersQuery,
  useUpdateBannerMutation,
} from "@/components/store/api/banner/bannerApi";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Table from "@/components/ui/table";
import { AlertCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import AddEditBannerModal from "./AddEditBannerModal";
import Pagination from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import ButtonLoader from "@/components/loader/ButtonLoader";

const BannerList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const [currentBanner, setCurrentBanner] = useState<
    { bannerId: number | null; brandId: number; image: string; link:string; } | undefined
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
  const { data, isLoading, isError, refetch } = useGetBannersQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });
  const [addBanner, { isLoading: addLoading, error: addError }] =
    useAddBannerMutation();
  const [updateBanner, { isLoading: editLoading, error: editError }] =
    useUpdateBannerMutation();
  const [deleteBanner, { isLoading: deleteLoading, error: deleteError }] =
    useDeleteBannerMutation();

  // Banner List
  const banners = data?.data || [];

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

  const handleSaveBanner = async (
    bannerId: number | null,
    data: { link: string; image: string }
  ) => {
    try {
      if (bannerId) {
        const result = await updateBanner({
          id: bannerId,
          data: data,
        }).unwrap();

        if (result.success) {
          toast({
            title: "Update Banner Message",
            description: toastMessageGenerator("update", "banner"),
          });
          setModalOpen(false);
        }
      } else {
        const result = await addBanner(data).unwrap(); // ✅ correct shape
        if (result.success) {
          toast({
            title: "Add Banner Message",
            description: toastMessageGenerator("add", "banner"),
          });
          setModalOpen(false);
        }
      }

      refetch();
    } catch (err) {
      console.error("Error saving banner:", err);
    }
  };

  const handleDeleteBanner = async (id: number) => {
    try {
      await deleteBanner(id).unwrap();
      toast({
        title: "Banner deleted successfully",
        description: "The banner has been deleted.",
      });
      refetch(); // Refresh the banner list
    } catch (err) {
      console.error("Error deleting banner:", err);
    }
  };

  const handleAddBanner = () => {
    setCurrentBanner(undefined);
    setModalOpen(true);
  };

  const handleEditBanner = (banner: {
    id: number;
    brandId: number;
    image: string;
    link:string;
  }) => {
    setCurrentBanner({
      bannerId: banner.id, // Map `id` to `bannerId`
      brandId: banner.brandId,
      image: banner.image,
      link:banner.link
    });
    setModalOpen(true);
  };
  if (isLoading) {
    return <LoaderSpinner />;
  }
  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Main Slider</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">
              Export
            </button>
            <button
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddBanner}
            >
              <Plus className="font-bold w-4 h-4" /> Add Slider
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

        {/* Error State */}
        {isError && (
          <div className="text-center py-6 text-red-500">
            Failed to fetch banners.
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          //@ts-ignore
          <Table
            headers={["SL", "Image", "Link", "Action"]}
            data={banners}
            renderRow={(row, index: number) => {
              const dynamicIndex =
                index + 1 + (pagination.page - 1) * pagination.size;
              return (
                <>
                  <td className="px-4 py-2">{dynamicIndex}</td>
                  <td className="px-4 py-2">
                    {row.image ? (
                      <img
                        src={row.image}
                        alt={row.banner}
                        className="w-full h-12 object-contain rounded-md"
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-2 font-medium">{row?.link}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditBanner(row)}
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
                            onClick={() => handleDeleteBanner(row.id)}
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
        <AddEditBannerModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={(data) =>
            //@ts-ignore
            handleSaveBanner(currentBanner?.bannerId ?? null, data)
          }
          //@ts-ignore
          currentBanner={currentBanner}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default BannerList;
