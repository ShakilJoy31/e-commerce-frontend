import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { useGetCompanyInfoAllQuery } from "@/components/store/api/company/companyApi";

const CheckoutNotice = ({ selectedPaymentMethod }:any) => {
  const { data: companyInfo, isLoading: bannerLoading } = useGetCompanyInfoAllQuery({});
  
  if (bannerLoading) {
    return <LoaderSpinner />;
  }

  if (!companyInfo || companyInfo?.data?.length === 0) {
    return <div className="text-center py-4">No company information available</div>;
  }

  const noticeData = companyInfo?.data[0];

  const getPaymentNotice = () => {
    switch (selectedPaymentMethod) {
      case 'ONLINE':
        return noticeData.onlinePaymentNotice
      case 'EMI':
        return noticeData.emiPaymentNotice
      case 'COD':
        return noticeData.codNotice
      default:
        return "Please select a payment method.";
    }
  };

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            {getPaymentNotice()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutNotice;