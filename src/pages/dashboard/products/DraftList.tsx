import PageWrapper from "@/components/common/wrapper/PageWrapper";
import DeleteModal from "@/components/deleteModal/DeleteModal";
import ButtonLoader from "@/components/loader/ButtonLoader";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/components/store/api/products/productApi";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Pagination from "@/components/ui/pagination";
import Table from "@/components/ui/table";
import { Product } from "@/types/product/product";
import { useEffect, useState } from "react";
import { FcViewDetails } from "react-icons/fc";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import ProductDetail from "./ProductDetail";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { useSelector } from "react-redux";
import { selectUser } from "@/components/store/store";

const headers = [
  "Index",
  "Product Name",
  "Category",
  "Brand",
  "Action",
];

const DraftList = ({ selectedRows, setSelectedRows }: any) => {
  const user = useSelector(selectUser);
  const [products, setProducts] = useState<Product[]>([]);
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

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<number[]>([]);

  const type = "Draft";
  const {
    data: productsData,
    isLoading: productLoading,
    refetch,
  } = useGetProductsQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    type: type,
    search: searchTerm,
  }) as any;

  const [deleteProduct, { isLoading: deleteLoading, isError: deleteError }] =
    useDeleteProductMutation();

  useEffect(() => {
    if (productsData) {
      setProducts(productsData.data);
      setPagination((prev) => ({
        ...prev,
        meta: {
          page: productsData.meta.page,
          size: productsData.meta.size,
          total: productsData.meta.total,
          totalPage: productsData.meta.totalPage,
        },
      }));
    }
  }, [productsData]);

  const handleRowSelect = (product: any) => {
    setSelectedRows((prev) =>
      prev.some((selectedProduct) => selectedProduct.id === product.id)
        ? prev.filter((selectedProduct) => selectedProduct.id !== product.id)
        : [...prev, product]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === productsData?.data?.length) {
      // Deselect all if all rows are selected
      setSelectedRows([]);
    } else {
      // Select all rows (store full order objects in selectedRows)
      setSelectedRows(productsData?.data || []);
    }
  };

  const handleDelete = async () => {
    try {
      const deletePromises = itemsToDelete.map((id) =>
        deleteProduct(id).unwrap()
      );
      await Promise.all(deletePromises);
      refetch();
      setSelectedRows([]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error deleting products:", err);
    }
  };

  const openDeleteModal = (ids: number[]) => {
    setItemsToDelete(ids);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setItemsToDelete([]);
  };

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

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        {/* Header Section */}

        {/* Filters and Search Section */}
        <div className="flex justify-between items-center bg-white px-4 rounded-t-lg">
          <div className="flex gap-4 items-center my-4">
            <select
              className="border rounded px-4 py-1.5 text-blue-500 w-36"
              onChange={(e) => setStatusFilter(e.target.value)}
              value={statusFilter}
            >
              <option value="">Filter</option>
              <option value="Ready">Ready</option>
              <option value="Shipped">Shipped</option>
            </select>

            <div className="relative w-1/3">
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
          <div className="space-x-2 py-5">
            {user?.role === "SUPER_ADMIN" && (
              <>
                <button
                  onClick={() => openDeleteModal(selectedRows)}
                  disabled={selectedRows.length === 0 || productLoading}
                  className={`px-4 py-1 rounded border ${
                    selectedRows.length > 0
                      ? "text-red-500 border-red-500 hover:bg-red-50"
                      : "text-gray-400 border-gray-300 cursor-not-allowed"
                  }`}
                >
                  <FiTrash2 className="inline-block mr-1" /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        {productLoading ? (
          <div className="flex justify-center mt-5 min-h-screen items-center w-full h-full">
            <LoaderSpinner />
          </div>
        ) : (
          <Table
            headers={headers}
            data={products}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
            renderRow={(product: Product, index: number) => {
              const dynamicIndex =
                index + 1 + (pagination.page - 1) * pagination.size;
              return (
                <>
                  <td className="px-4 py-2">{dynamicIndex}</td>
                  <td className="px-4 py-2 flex items-center gap-4">
                    <img
                      src={product.ProductImage?.[0]?.imageUrl || ""}
                      alt="Product"
                      className="w-10 h-10 object-cover rounded border"
                    />
                    <span className="text-blue-500 font-medium">
                      {product.productName}
                    </span>
                  </td>
                  <td className="px-4 py-2">{product?.category?.name}</td>
                 
                  <td className="px-4 py-2">{product?.brand?.brand}</td>

                  <td className="px-4 py-2 flex gap-2 items-center">
                    <Link to={`/kry-admin-portal/edit-product/${product?.productLink}`}>
                      <button className="text-blue-600 hover:text-blue-800">
                        <FiEdit className="w-6 h-6" />
                      </button>
                    </Link>
                    <Dialog>
                      <DialogTrigger asChild>
                        <FcViewDetails className="text-[25px] cursor-pointer" />
                      </DialogTrigger>
                      <DialogContent className="p-6 rounded-lg shadow-lg sm:max-w-[1200px] h-[90vh] overflow-y-auto">
                        <ProductDetail product={product?.productLink} />
                      </DialogContent>
                    </Dialog>
                    {user?.role === "SUPER_ADMIN" && (
                      <>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => openDeleteModal([product.id])}
                        >
                          <FiTrash2 className="w-6 h-6 -mt-2" />
                        </button>
                      </>
                    )}
                  </td>
                </>
              );
            }}
          />
        )}
        {/* Reusable Table */}
      </div>

      <div className="my-10">
        <Pagination
          totalPages={pagination.meta.totalPage || 1}
          currentPage={pagination.page}
          itemsPerPage={pagination.size}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <DeleteModal
          isOpen={isModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        >
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete the selected items?</p>
            {deleteError && (
              <p className="text-red-500 mt-2">An error occurred. Try again.</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className={`px-4 py-2 ${
                  deleteLoading
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-red-500 text-white"
                } rounded`}
              >
                {deleteLoading ? <ButtonLoader /> : "Delete"}
              </button>
            </div>
          </div>
        </DeleteModal>
      )}
    </PageWrapper>
  );
};

export default DraftList;
