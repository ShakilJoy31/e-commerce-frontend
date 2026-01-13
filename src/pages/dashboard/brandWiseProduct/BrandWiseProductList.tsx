import PageWrapper from "@/components/common/wrapper/PageWrapper";
import Table from "@/components/ui/table";
import { AlertCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
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
import {
  useAddBrandWiseProductMutation,
  useDeleteBrandWiseProductMutation,
  useGetBrandWiseProductsQuery,
  useUpdateBrandWiseProductMutation,
} from "@/components/store/api/brandWiseProduct/brandWiseProductApi";
import AddEditBrandWiseProductModal from "./AddEditBrandWiseProductModal";

interface CategoryWiseProduct {
  id: number;
  brandId: number;
  productId: number;
  product: {
    productName: string;
  };
  brand: {
    brand: string;
  };
}

const headers = ["SL", "Product", "Brand", "Action"];

const BrandWiseProductList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] =
    useState<CategoryWiseProduct | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  const { data, refetch, isLoading } = useGetBrandWiseProductsQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });
  useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        meta: data.meta,
      }));
    }
  }, [data]);

  const brandWiseProducts = data?.data || [];

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
  const [addBrandWiseProduct, { isLoading: addLoading, error: addError }] =
    useAddBrandWiseProductMutation();
  const [updateBrandWiseProduct, { isLoading: editLoading, error: editError }] =
    useUpdateBrandWiseProductMutation();
  const [
    deleteBrandWiseProduct,
    { isLoading: deleteLoading, error: deleteError },
  ] = useDeleteBrandWiseProductMutation();

  const handleAddProduct = () => {
    setModalType("add");
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: CategoryWiseProduct) => {
    setModalType("edit");
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    await deleteBrandWiseProduct(id);
    toast({
      title: "Brand-wise Product deleted successfully",
      description: "The product has been removed from the brand.",
    });
    refetch();
  };

  const handleSubmit = async (data: any) => {
    const formattedData = {
      ...data,
    };

    if (modalType === "add") {
      const result = await addBrandWiseProduct(formattedData);
      if (result.data.success) {
        toast({
          title: "Add Brand Product Message",
          description: toastMessageGenerator("add", "product"),
        });
        setIsModalOpen(false);
      }
    } else if (modalType === "edit") {
      const result = await updateBrandWiseProduct({
        id: selectedProduct!.id,
        data: formattedData,
      });
      if (result.data.success) {
        toast({
          title: "Update brand Product Message",
          description: toastMessageGenerator("update", "product"),
        });
        setIsModalOpen(false);
      }
    }
    refetch();
  };

  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === brandWiseProducts.length) {
      setSelectedRows([]); // Deselect all
    } else {
      setSelectedRows(brandWiseProducts.map((row) => row.id));
    }
  };
  if (isLoading) {
    return <LoaderSpinner />;
  }
  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen p-4">

        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Brand Wise Product</h1>
          <button
            className="flex items-center bg-blue-500 text-white px-4 py-1 rounded"
            onClick={handleAddProduct}
          >
            <Plus className="mr-2" /> Add Brand Wise Product
          </button>
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

        

        {brandWiseProducts.length > 0 ? (
          <Table
            headers={headers}
            data={brandWiseProducts}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
            renderRow={(row: CategoryWiseProduct, index: number) => {
              const dynamicIndex =
                index + 1 + (pagination.page - 1) * pagination.size;
              return (
                <>
                  <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                  <td className="px-4 py-2">{row?.product?.productName}</td>
                  <td className="px-4 py-2">{row?.brand?.brand}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="text-blue-500"
                      onClick={() => handleEditProduct(row)}
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
                            onClick={() => handleDeleteProduct(row.id)}
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
        ) : (
          <p className="text-center text-gray-500">
            No Brand wise products found.
          </p>
        )}

        {deleteError && "data" in deleteError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Brand Wise Product Error</AlertTitle>
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
        {isModalOpen && (
          <AddEditBrandWiseProductModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            initialData={modalType === "edit" ? selectedProduct : null}
            loading={addLoading || editLoading}
            err={addError || editError}
          />
        )}
      </div>
    </PageWrapper>
  );
};

export default BrandWiseProductList;
