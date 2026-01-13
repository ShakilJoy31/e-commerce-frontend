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
  useAddSectionWiseProductShowMutation,
  useDeleteSectionWiseProductShowMutation,
  useGetAllSectionWiseProductShowsQuery,
  useUpdateSectionWiseProductShowMutation,
} from "@/components/store/api/section/sectionWiseApi";
import AddEditSectionWiseModal from "./AddEditSectionWiseModal";

const SectionWiseProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const [currentSectionProduct, setCurrentSectionProduct] = useState<
    | {
        id: number | null;
        sectionId: number;
        productId: number;
      }
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

  // API Calls
  const { data, isLoading, isError, refetch } =
    useGetAllSectionWiseProductShowsQuery({
      sort: pagination.sort,
      page: pagination.page,
      size: pagination.size,
      search: searchTerm,
    });

  const [addSectionProduct, { isLoading: addLoading, error: addError }] =
    useAddSectionWiseProductShowMutation();
  const [updateSectionProduct, { isLoading: editLoading, error: editError }] =
    useUpdateSectionWiseProductShowMutation();
  const [
    deleteSectionProduct,
    { isLoading: deleteLoading, error: deleteError },
  ] = useDeleteSectionWiseProductShowMutation();

  const sectionProducts = data?.data || [];

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

  const handleSaveSectionProduct = async (payload: {
    id: number | null;
    sectionId: number;
    productId: number;
  }) => {
    try {
      if (payload.id) {
        // Update existing section-product mapping
        const result = await updateSectionProduct({
          id: payload.id,
          data: { sectionId: payload.sectionId, productId: payload.productId },
        }).unwrap();

        if (result.success) {
          toast({
            title: "Success",
            description: toastMessageGenerator(
              "update",
              "section-wise product"
            ),
          });
          setModalOpen(false);
        }
      } else {
        // Add new section-product mapping
        const result = await addSectionProduct({
          sectionId: payload.sectionId,
          productId: payload.productId,
        }).unwrap();

        if (result.success) {
          toast({
            title: "Success",
            description: toastMessageGenerator("add", "section-wise product"),
          });
          setModalOpen(false);
        }
      }
      refetch();
    } catch (err) {
      console.error("Error saving section-wise product:", err);
      toast({
        title: "Error",
        description: "Failed to save section-wise product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSectionProduct = async (id: number) => {
    try {
      await deleteSectionProduct(id).unwrap();
      toast({
        title: "Success",
        description: "Section-wise product mapping deleted successfully",
      });
      refetch();
    } catch (err) {
      console.error("Error deleting section-wise product:", err);
      toast({
        title: "Error",
        description: "Failed to delete section-wise product",
        variant: "destructive",
      });
    }
  };

  const handleAddSectionProduct = () => {
    setCurrentSectionProduct(undefined);
    setModalOpen(true);
  };

  const handleEditSectionProduct = (sectionProduct: {
    id: number;
    sectionId: number;
    productId: number;
    sectionName?: string;
    productName?: string;
  }) => {
    setCurrentSectionProduct({
      id: sectionProduct.id,
      sectionId: sectionProduct.sectionId,
      productId: sectionProduct.productId,
    });
    setModalOpen(true);
  };

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Section-Wise Products</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">
              Export
            </button>
            <button
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddSectionProduct}
            >
              <Plus className="font-bold w-4 h-4" /> Add Section Wise Product
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
            Failed to fetch section-wise products.
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <Table
            headers={["SL", "Section", "Product", "Action"]}
            data={sectionProducts}
            selectedRows={selectedRows}
            onRowSelect={(id) => {
              setSelectedRows((prev) =>
                prev.includes(id)
                  ? prev.filter((rowId) => rowId !== id)
                  : [...prev, id]
              );
            }}
            onSelectAll={() => {
              if (selectedRows.length === sectionProducts.length) {
                setSelectedRows([]);
              } else {
                setSelectedRows(sectionProducts.map((item) => item.id));
              }
            }}
            renderRow={(row, index: number) => {
              const dynamicIndex =
                index + 1 + (pagination.page - 1) * pagination.size;
              return (
                <>
                  <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                  <td className="px-4 py-2 font-medium">
                    {row?.section?.name || "Not Found"}
                  </td>
                  <td className="px-4 py-2 font-medium">
                    {row?.product?.productName || "Not Found"}
                  </td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditSectionProduct(row)}
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
                            This will remove the product from this section.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="btn-destructive-fill">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteSectionProduct(row.id)}
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

        {/* Add/Edit Modal */}
        <AddEditSectionWiseModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveSectionProduct}
          currentSection={currentSectionProduct}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default SectionWiseProduct;
