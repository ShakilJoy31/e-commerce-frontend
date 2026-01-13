import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import BlogFormModal from "./BlogFormModal";
import { useToast } from "@/components/ui/use-toast";
import DeleteModal from "@/components/deleteModal/DeleteModal";
import ButtonLoader from "@/components/loader/ButtonLoader";
import Table from "@/components/ui/table";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import Pagination from "@/components/ui/pagination";
import {
  useDeletePostMutation,
  useGetAllPostsQuery,
} from "@/components/store/api/blogPost/blogPostApi";
import { FcViewDetails } from "react-icons/fc";
import { IoEyeOutline } from "react-icons/io5";
import BulkActions from "../products/BulkActions";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { Link } from "react-router-dom";

const headers = ["SL", "Title", "Author", "Status", "Created At", "Actions"];

const BlogPost = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    sort: "asc",
    page: 1,
    size: 10,
    search: "",
    status: "",
    meta: {
      page: null,
      size: null,
      total: null,
      totalPage: null,
    },
  });
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<number[]>([]);
  const [selectOption, setSelectOption] = useState<string | undefined>("");
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const {
    data: postsData,
    isLoading,
    refetch,
  } = useGetAllPostsQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: pagination.search,
    status: pagination.status,
  });

  const [deletePost, { isLoading: deleteLoading }] = useDeletePostMutation();

  useEffect(() => {
    if (postsData) {
      setPagination((prev) => ({
        ...prev,
        meta: {
          page: postsData.meta.page,
          size: postsData.meta.size,
          total: postsData.meta.total,
          totalPage: postsData.meta.totalPage,
        },
      }));
    }
  }, [postsData]);

  const handleRowSelect = (post: any) => {
    setSelectedRows((prev) =>
      prev.some((selectedPost) => selectedPost.id === post.id)
        ? prev.filter((selectedPost) => selectedPost.id !== post.id)
        : [...prev, post]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === postsData?.data?.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(postsData?.data || []);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      if (selectedRows.length === 0) {
        toast({
          title: "No Items Selected",
          description: "Please select at least one item to delete.",
          variant: "destructive",
        });
        return;
      }

      const deletePromises = selectedRows.map((post) =>
        deletePost(post.id).unwrap()
      );
      await Promise.all(deletePromises);

      toast({
        title: "Deleted Successfully",
        description: "Selected blog posts have been deleted.",
      });

      refetch();
      setSelectedRows([]);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete blog posts.",
        variant: "destructive",
      });
    }
  };

  const openBulkModal = () => setIsBulkModalOpen(true);
  const closeBulkModal = () => setIsBulkModalOpen(false);

  const openDeleteModal = (ids: number[]) => {
    setItemsToDelete(ids);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const deletePromises = itemsToDelete.map((id) => deletePost(id).unwrap());
      await Promise.all(deletePromises);

      toast({
        title: "Deleted Successfully",
        description: "Selected blog posts have been deleted.",
      });

      refetch();
      setSelectedRows(
        selectedRows.filter((post) => !itemsToDelete.includes(post.id))
      );
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete blog posts.",
        variant: "destructive",
      });
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemsToDelete([]);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (size: number) => {
    setPagination((prev) => ({ ...prev, size, page: 1 }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPagination((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPagination((prev) => ({ ...prev, status: e.target.value, page: 1 }));
  };

  if (isLoading) {
    return <LoaderSpinner />;
  }

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Blog Posts</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">
              Export
            </button>
            <Link to={"/kry-admin-portal/add-blog"}>
              {" "}
              <button className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-1" />
                Add Blog Post
              </button>
            </Link>
          </div>
        </div>
        {/* Filters and Search Section */}
        <div className="flex justify-between items-center bg-white px-4 rounded-t-lg">
          <div className="flex gap-4 items-center my-4">
            <select
              className="border rounded px-4 py-1.5 text-blue-500 w-36"
              onChange={handleStatusFilter}
              value={pagination.status}
            >
              <option value="">Filter</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="trash">Trash</option>
            </select>

            <select
              className="border rounded px-4 py-1.5 text-blue-500 w-full"
              onChange={(e) => setSelectOption(e.target.value)}
              value={selectOption}
            >
              <option value="">Bulk Action</option>
              <option value="StatusChange">Change Status</option>
              <option value="AuthorChange">Change Author</option>
            </select>

            <div className="relative w-1/3">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded pl-10 pr-3 py-1 text-gray-700 w-60"
                value={pagination.search}
                onChange={handleSearch}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="space-x-2 py-5">
            <button
              onClick={handleDeleteSelected}
              disabled={selectedRows.length === 0}
              className={`px-4 py-1.5 -mt-1 rounded border ${
                selectedRows.length > 0
                  ? "text-red-500 border-red-500 hover:bg-red-50"
                  : "text-gray-400 border-gray-300 cursor-not-allowed"
              }`}
            >
              <FiTrash2 className="inline-block mr-1" /> Delete Selected
            </button>

            {selectOption === "StatusChange" && (
              <button
                disabled={selectedRows.length === 0}
                className={`px-4 py-1 rounded border ${
                  selectedRows.length > 0
                    ? "text-blue-500 border-blue-500 hover:bg-blue-50"
                    : "text-gray-400 border-gray-300 cursor-not-allowed"
                }`}
                onClick={openBulkModal}
              >
                Change Status
              </button>
            )}

            {selectOption === "AuthorChange" && (
              <button
                disabled={selectedRows.length === 0}
                className={`px-4 py-1 rounded border ${
                  selectedRows.length > 0
                    ? "text-blue-500 border-blue-500 hover:bg-blue-50"
                    : "text-gray-400 border-gray-300 cursor-not-allowed"
                }`}
                onClick={openBulkModal}
              >
                Change Author
              </button>
            )}
          </div>
        </div>

        <Table
          headers={headers}
          data={postsData?.data || []}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
          renderRow={(post, index) => {
            const dynamicIndex =
              index + 1 + (pagination.page - 1) * pagination.size;
            return (
              <>
                <td className="px-4 py-2">{dynamicIndex}</td>
                <td className="px-4 py-2">
                  <span className="text-blue-500 font-medium">
                    {post.title}
                  </span>
                </td>
                <td className="px-4 py-2">{post?.author || "N/A"}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      post.status === "published"
                        ? "bg-green-100 text-green-800"
                        : post.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 flex gap-2 items-center">
                  <Link to={`/kry-admin-portal/edit-post/${post.slug}`}>
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiEdit className="w-6 h-6" />
                    </button>
                  </Link>

                  <a
                    href={`/blogs/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="text-green-700">
                      <IoEyeOutline className="text-3xl" />
                    </button>
                  </a>
                  <Dialog>
                    <DialogTrigger asChild>
                      <FcViewDetails className="text-[25px] cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="p-6 rounded-lg shadow-lg sm:max-w-[900px] h-[90vh] overflow-y-auto">
                      {/* <BlogDetail blogId={post._id} /> */}
                      Blog Detail View
                    </DialogContent>
                  </Dialog>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => openDeleteModal([post.id])}
                  >
                    <FiTrash2 className="w-6 h-6 -mt-2" />
                  </button>
                </td>
              </>
            );
          }}
        />

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
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        >
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete the selected items?</p>
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

        {/* Bulk Actions Modal */}
        <Dialog open={isBulkModalOpen} onOpenChange={closeBulkModal}>
          <DialogContent>
            <BulkActions
              selectOption={selectOption}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              refetch={refetch}
              closeBulkModal={closeBulkModal}
            />
          </DialogContent>
        </Dialog>

        {/* Add Blog Post Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="p-6 rounded-lg shadow-lg sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <BlogFormModal
              onSuccess={() => {
                setIsModalOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
};

export default BlogPost;
