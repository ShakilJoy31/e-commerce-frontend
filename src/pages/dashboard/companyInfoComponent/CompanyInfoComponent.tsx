import {
  useDeleteCompanyMutation,
  useGetCompanyInfoAllQuery,
} from "@/components/store/api/company/companyApi";
import { FiEdit, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function CompanyInfoComponent() {
  const { data, isLoading, isError } = useGetCompanyInfoAllQuery({
    page: 1,
    size: 10,
  });
  const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation();
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this company info?")) {
      try {
        await deleteCompany(id).unwrap();
        alert("Company info deleted successfully.");
      } catch (error) {
        console.error("Error deleting company info:", error);
        alert("Failed to delete company info.");
      }
    }
  };

  if (isLoading) return <div>Loading company info...</div>;
  if (isError) return <div>Error loading company info.</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Company Info</h1>
        <button
          onClick={() => navigate("/kry-admin-portal/add_company")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Company Info
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data?.data?.map((company: any) => (
          <div
            key={company.id}
            className="bg-white shadow rounded-lg p-4 flex flex-col"
          >
            <img
              src={company.logo || "https://via.placeholder.com/150"}
              alt={company.companyName}
              className="w-full h-32 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-bold">{company.companyName}</h3>
            <p className="text-gray-600">{company.address}</p>
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => navigate(`/kry-admin-portal/edit_company/${company.id}`)}
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                <FiEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(company.id)}
                className="text-red-600 hover:underline flex items-center gap-2"
                disabled={isDeleting}
              >
                <FiTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
