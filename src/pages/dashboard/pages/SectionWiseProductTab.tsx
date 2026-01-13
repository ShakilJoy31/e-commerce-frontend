import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetSectionsQuery } from "@/components/store/api/section/sectionApi";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import ProductExcel from "../pdf/ProductExcel";
import {
  useAddSectionWiseProductShowMutation,
  useDeleteSectionWiseProductShowMutation,
  useGetAllSectionWiseProductShowsQuery,
  useUpdateSectionWiseProductShowMutation,
} from "@/components/store/api/section/sectionWiseApi";
import Table from "@/components/ui/table";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
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
import AddEditSectionWiseModal from "./AddEditSectionWiseModal";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import Pagination from "@/components/ui/pagination";
import ButtonLoader from "@/components/loader/ButtonLoader";

const SectionWiseProductTab = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSectionProduct, setCurrentSectionProduct] = useState<
    | {
        id: number | null;
        sectionId: number;
        productId: number;
      }
    | undefined
  >(undefined);
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

  const { toast } = useToast();

  // API Calls
  const { data: sectionsData, isLoading: sectionsLoading } =
    useGetSectionsQuery({
      page: 1,
      size: 100,
    });

  const {
    data: sectionProductsData,
    isLoading: productsLoading,
    refetch,
  } = useGetAllSectionWiseProductShowsQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });

  const [addSectionProduct, { isLoading: addLoading, error: addError }] =
    useAddSectionWiseProductShowMutation();
  const [updateSectionProduct, { isLoading: editLoading, error: editError }] =
    useUpdateSectionWiseProductShowMutation();
  const [deleteSectionProduct, { isLoading: deleteLoading }] =
    useDeleteSectionWiseProductShowMutation();

  // Update pagination meta when data changes
  useEffect(() => {
    if (sectionProductsData) {
      setPagination((prev) => ({
        ...prev,
        meta: {
          page: sectionProductsData.meta.page,
          size: sectionProductsData.meta.size,
          total: sectionProductsData.meta.total,
          totalPage: sectionProductsData.meta.totalPage,
        },
      }));
    }
  }, [sectionProductsData]);

  // Group products by section
  const groupedProducts = sectionProductsData?.data?.reduce((acc, product) => {
    const sectionId = product.sectionId;
    if (!acc[sectionId]) {
      acc[sectionId] = {
        section: product.section,
        products: [],
      };
    }
    acc[sectionId].products.push(product);
    return acc;
  }, {});

  // Get products for current tab
  const getCurrentTabProducts = () => {
    if (activeTab === "all") {
      return sectionProductsData?.data || [];
    }
    return groupedProducts?.[activeTab]?.products || [];
  };

  const handleSaveSectionProduct = async (payload: {
    id: number | null;
    sectionId: number;
    productId: number;
  }) => {
    try {
      if (payload.id) {
        // Update existing
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
        }
      } else {
        // Add new
        const result = await addSectionProduct({
          sectionId: payload.sectionId,
          productId: payload.productId,
        }).unwrap();
        if (result.success) {
          toast({
            title: "Success",
            description: toastMessageGenerator("add", "section-wise product"),
          });
        }
      }
      setModalOpen(false);
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

  const handleEditSectionProduct = (product: {
    id: number;
    sectionId: number;
    productId: number;
  }) => {
    setCurrentSectionProduct({
      id: product.id,
      sectionId: product.sectionId,
      productId: product.productId,
    });
    setModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination((prev) => ({ ...prev, size: itemsPerPage, page: 1 }));
  };

  if (sectionsLoading || productsLoading) {
    return <LoaderSpinner />;
  }

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Section-Wise Products</h1>
        <div className="flex items-center gap-2">
          <ProductExcel data={selectedRows} />
          <button
            className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            onClick={handleAddSectionProduct}
          >
            <Plus className="font-bold w-4 h-4" /> Add Section Product
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white px-4 rounded-lg">
        <div className="relative w-full my-4">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded pl-10 pr-3 py-1 text-gray-700 w-full max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border overflow-x-auto">
          <TabsTrigger
            value="all"
            className="text-xl font-semibold px-2  flex gap-1"
          >
            All{" "}
            {/* <span className="text-primary">
              ({sectionProductsData?.data?.length || 0})
            </span> */}
          </TabsTrigger>
          {sectionsData?.data?.map((section) => (
            <TabsTrigger
              key={section.id}
              value={section.id.toString()}
              className="text-xl font-semibold px-2 flex gap-1"
            >
              {section.name}{" "}
              {/* <span className="text-primary">
                ({groupedProducts?.[section.id]?.products?.length || 0})
              </span> */}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All Products Tab */}
        <TabsContent value="all">
          <div className="bg-white rounded-lg shadow p-4 mt-4">
            <Table
              headers={["SL", "Section", "Product", "Action"]}
              data={getCurrentTabProducts()}
              selectedRows={selectedRows}
              onRowSelect={(id) =>
                setSelectedRows((prev) =>
                  prev.includes(id)
                    ? prev.filter((rowId) => rowId !== id)
                    : [...prev, id]
                )
              }
              onSelectAll={() => {
                const products = getCurrentTabProducts();
                setSelectedRows((prev) =>
                  prev.length === products.length
                    ? []
                    : products.map((item) => item.id)
                );
              }}
              renderRow={(row, index) => (
                <>
                  <td className="px-4 py-2 font-medium">
                    {index + 1 + (pagination.page - 1) * pagination.size}
                  </td>
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
                        <button className="text-red-600 hover:text-red-800">
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
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
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
              )}
            />
            <Pagination
              totalPages={pagination.meta.totalPage || 1}
              currentPage={pagination.page}
              itemsPerPage={pagination.size}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </TabsContent>

        {/* Section-specific Tabs */}
        {sectionsData?.data?.map((section) => (
          <TabsContent key={section.id} value={section.id.toString()}>
            <div className="bg-white rounded-lg shadow p-4 mt-4">
              <Table
                headers={["SL", "Product", "Action"]}
                data={getCurrentTabProducts()}
                selectedRows={selectedRows}
                onRowSelect={(id) =>
                  setSelectedRows((prev) =>
                    prev.includes(id)
                      ? prev.filter((rowId) => rowId !== id)
                      : [...prev, id]
                  )
                }
                onSelectAll={() => {
                  const products = getCurrentTabProducts();
                  setSelectedRows((prev) =>
                    prev.length === products.length
                      ? []
                      : products.map((item) => item.id)
                  );
                }}
                renderRow={(row, index) => (
                  <>
                    <td className="px-4 py-2 font-medium">
                      {index + 1 + (pagination.page - 1) * pagination.size}
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
                          <button className="text-red-600 hover:text-red-800">
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
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
                )}
              />
              <Pagination
                totalPages={pagination.meta.totalPage || 1}
                currentPage={pagination.page}
                itemsPerPage={pagination.size}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

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
  );
};

export default SectionWiseProductTab;
