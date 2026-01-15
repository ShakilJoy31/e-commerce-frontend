/* eslint-disable @typescript-eslint/ban-ts-comment */
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
  useAddBrandMutation,
  useDeleteBrandMutation,
  useGetBrandsQuery,
  useUpdateBrandMutation,
} from "@/components/store/api/brand/brandApi";
import Table from "@/components/ui/table";
import { AlertCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import AddEditBrandModal from "./AddEditBrandModal";
import Pagination from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { removeFalsyValuesProperties } from "@/utils/helper/removeFalsyValuesProperties";

const BrandList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(undefined);
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
  const { data, isLoading, isError, refetch } = useGetBrandsQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });

  const [addBrand, { isLoading: addBrandLoading, error: addError }] =
    useAddBrandMutation();

  const [updateBrand, { isLoading: updateBrandLoading, error: updateError }] =
    useUpdateBrandMutation();

  const [deleteBrand, { isLoading: deleteBrandLoading, error: deleteError }] =
    useDeleteBrandMutation();

  // Brand List
  const brands = data?.data || [];

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

  const handleSaveBrand = async (
    id: number | null,
    brand: string,
    image: string,
    isShippedFree:boolean,
    offerImage:string,
    description:string,
    categories: number[],
  ) => {
    try {
      if (id) {
        // Update Brand
        const updatebrand={
         brand:brand, image:image, offerImage:offerImage, description:description, categories:categories, isShippedFree:isShippedFree
        }
        const cleanData=removeFalsyValuesProperties(updatebrand, ["offerImage", "description", "image"])
        const result = await updateBrand({
          id,
          data: cleanData,
        }).unwrap();
        if (result.success) {
          toast({
            title: "Update Brand Message",
            description: toastMessageGenerator("update", "brand"),
          });
          setModalOpen(false);
        }
      } else {
        
        const brandData = {
          brand: brand,
          image: image,
          isShippedFree:isShippedFree,
          offerImage:offerImage,
          description:description,
          categories: categories
        };
        const cleanData=removeFalsyValuesProperties(brandData, ["offerImage", "description", "image"])
        // Add Brand
        const result = await addBrand(cleanData).unwrap();
        if (result.success) {
          toast({
            title: "Add Brand Message",
            description: toastMessageGenerator("add", "brand"),
          });
          setModalOpen(false);
        }
      }
      refetch(); // Refresh the brand list
      setModalOpen(false);
    } catch (err) {
      console.error("Error saving brand:", err);
    }
  };

  const handleDeleteBrand = async (id: number) => {
    try {
      await deleteBrand(id).unwrap();
      toast({
        title: "Brand deleted successfully",
        description: "The brand has been deleted.",
      });
      refetch(); // Refresh the brand list
    } catch (err) {
      console.error("Error deleting brand:", err);
    }
  };

  const handleAddBrand = () => {
    setCurrentBrand(undefined);
    setModalOpen(true);
  };

  const handleEditBrand = (brand: any) => {
    setCurrentBrand(brand);
    setModalOpen(true);
  };

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Brands</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">
              Export
            </button>
            <button
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddBrand}
            >
              <Plus className="font-bold w-4 h-4" /> Add Brand
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
            Failed to fetch brands.
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          //@ts-ignore
          <Table
            headers={["SL", "Logo", "Brand", "Shipping Status", "Action"]}
            data={brands}
            renderRow={(row, index: number) => {
              const dynamicIndex =
                index + 1 + (pagination.page - 1) * pagination.size;
              return (
                <>
                  <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                  <td className="px-4 py-2">
                    {row.image ? (
                      <img
                        src={row.image}
                        alt={row.brand}
                        className="w-full h-12 object-contain mx-auto rounded-md"
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-2 font-medium">{row.brand}</td>
                  <td className="px-4 py-2 font-medium">{row.isShippedFree? "Free":"Paid"}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditBrand(row)}
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
                            onClick={() => handleDeleteBrand(row.id)}
                          >
                            {deleteBrandLoading && <ButtonLoader />} Confirm
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
            <AlertTitle>Category Error</AlertTitle>
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
        <AddEditBrandModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveBrand}
          currentBrand={currentBrand}
          loading={addBrandLoading || updateBrandLoading}
          err={addError || updateError}
        />
      </div>
    </PageWrapper>
  );
};

export default BrandList;
