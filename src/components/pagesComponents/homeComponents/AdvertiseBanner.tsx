import { useGetCompanyInfoAllQuery } from "@/components/store/api/company/companyApi"
import { Link } from "react-router-dom"

const AdvertiseBanner = () => {
  const {data:banner}=useGetCompanyInfoAllQuery({})
  console.log(banner?.data)
  return (
    <div className="bg-gray-300 p-3 mb-5 rounded-md w-full h-auto lg:">
      <Link to={banner?.data[0]?.bannerOneLink}>
      <img src={banner?.data[0]?.bannerOne} alt="banner" className="w-full h-full"/>
      </Link>
    </div>
  )
}

export default AdvertiseBanner
