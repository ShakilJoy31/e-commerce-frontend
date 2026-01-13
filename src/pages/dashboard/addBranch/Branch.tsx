import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import { Plus } from "lucide-react";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import ButtonLoader from "@/components/loader/ButtonLoader";
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
import { AlertCircle } from "lucide-react";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import AddEditBranchModal from "./AddEditBranchModal";
import {
  useAddBranchMutation,
  useDeleteBranchMutation,
  useGetBranchesQuery,
  useUpdateBranchMutation,
} from "@/components/store/api/branch/branchApi";
import { removeFalsyValuesProperties } from "@/utils/helper/removeFalsyValuesProperties";

interface Branch {
  id: number;
  name: string;
  map: string;
  address: string;
  phone1: string;
  phone2: string;
  offDay: string;
  facebook: string;
  serialNo:number
}

const Branch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [pagination, setPagination] = useState({
    sort: "asc",
    page: 1,
    size: 10,
    meta: {
      page: null as number | null,
      size: null as number | null,
      total: null as number | null,
      totalPage: null as number | null,
    },
  });

  const { data, isLoading, isError, refetch } = useGetBranchesQuery({
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });

  const [addBranch, { isLoading: addLoading, error: addError }] =
    useAddBranchMutation();
  const [updateBranch, { isLoading: editLoading, error: editError }] =
    useUpdateBranchMutation();
  const [deleteBranch, { isLoading: deleteLoading }] =
    useDeleteBranchMutation();

  const branches = data?.data || [];

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

  const handleDeleteSelected = async () => {
    try {
      for (const id of selectedBranches) {
        await deleteBranch(id).unwrap();
      }
      toast({
        title: "Success",
        description: "Selected branches have been deleted successfully",
      });
      setSelectedBranches([]);
      refetch();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete selected branches",
        variant: "destructive",
      });
    }
  };

  const handleSaveBranch = async (id: number | null, data: Branch) => {
    try {
      // Clean the data by removing empty string properties
      const cleanedData = removeFalsyValuesProperties(data, [
        "map",
        "address",
        "phone1",
        "offDay",
      ]);

      const result = id
        ? //@ts-ignore
          await updateBranch({ id, ...cleanedData }).unwrap()
        : await addBranch(cleanedData).unwrap();

      if (result.success) {
        toast({
          title: id ? "Update Branch" : "Add Branch",
          description: toastMessageGenerator(id ? "update" : "add", "branch"),
        });
        setModalOpen(false);
        refetch();
      }
    } catch (err) {
      console.error("Error saving branch:", err);
    }
  };

  const handleDeleteBranch = async (id: number) => {
    try {
      await deleteBranch(id).unwrap();
      toast({
        title: "Branch deleted successfully",
        description: "The branch has been deleted.",
      });
      refetch();
    } catch (err) {
      console.error("Error deleting branch:", err);
    }
  };

  const handleAddBranch = () => {
    setCurrentBranch(null);
    setModalOpen(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setCurrentBranch(branch);
    setModalOpen(true);
  };

  const toggleBranchSelection = (id: number) => {
    setSelectedBranches((prev) =>
      prev.includes(id)
        ? prev.filter((branchId) => branchId !== id)
        : [...prev, id]
    );
  };

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen p-4">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold">Branches</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2 hover:bg-blue-50">
              Export
            </button>
            <button
              className="px-4 flex items-center gap-2 py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleAddBranch}
            >
              <Plus className="w-4 h-4" /> Add Branch
            </button>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-4">
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search branches..."
              className="border rounded pl-10 pr-3 py-2 text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedBranches.length === 0}
              className={`px-4 py-2 rounded border flex items-center gap-2 ${
                selectedBranches.length > 0
                  ? "text-red-500 border-red-500 hover:bg-red-50"
                  : "text-gray-400 border-gray-300 cursor-not-allowed"
              }`}
            >
              <FiTrash2 /> Delete Selected
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <LoaderSpinner />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to fetch branches. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Branches Grid */}
        {!isLoading && !isError && (
          <div className="flex gap-4">
            {branches.length === 0 ? (
              <p className="text-lg text-center">
                There is no branches available
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="border rounded-md p-4 space-y-3 bg-white shadow hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{branch.name} <span className="text-red-600">({branch?.serialNo})</span></h3>
                      <input
                        type="checkbox"
                        checked={selectedBranches.includes(branch.id)}
                        onChange={() => toggleBranchSelection(branch.id)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {branch.address || "-"}
                      </p>
                      <p>
                        <span className="font-medium">Off Day:</span>{" "}
                        {branch.offDay || "-"}
                      </p>
                      <p className="flex flex-col sm:flex-row sm:gap-4">
                        <span>
                          <span className="font-medium">Phone 1:</span>{" "}
                          {branch.phone1 || ""}
                        </span>

                        <div>
                          {branch.phone2 && (
                            <span className="font-medium">Phone 2:</span>
                          )}{" "}
                          {branch.phone2 || ""}
                        </div>
                      </p>
                      <p>
                        <div>
                          {branch.facebook && (
                            <>
                              <span className="font-medium">Facebook:</span>{" "}
                              <a
                                href={branch.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline cursor-pointer"
                              >
                                View Facebook Page
                              </a>
                            </>
                          )}
                        </div>
                      </p>
                      <p>
                        <div>
                          {branch.isBranchPickup===true ? (
                            <>
                              <span className="text-sm font-semibold">Branch Pickup:</span>{" "}
                              <span className="text-green-600 text-sm font-semibold">Active</span>
                            </>
                          ):<>
                              <span className="text-sm font-semibold">Branch Pickup:</span>{" "}
                              <span className="text-red-600 text-sm font-semibold">In Active</span>
                            </>}
                        </div>
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => handleEditBranch(branch)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                      >
                        <FiEdit />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50">
                            <FiTrash2 />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirm Deletion
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this branch? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteBranch(branch.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {deleteLoading ? <ButtonLoader /> : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        <AddEditBranchModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          //@ts-ignore
          onSave={handleSaveBranch}
          //@ts-ignore
          currentBranch={currentBranch}
          loading={addLoading || editLoading}
          err={addError || editError}
        />
      </div>
    </PageWrapper>
  );
};

export default Branch;
