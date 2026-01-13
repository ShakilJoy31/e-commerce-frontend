import AddWIthSliderProducts from "@/components/pagesComponents/homeComponents/AddWIthSliderProducts";
import AdvertiseBanner from "@/components/pagesComponents/homeComponents/AdvertiseBanner";
import Banner from "@/components/pagesComponents/homeComponents/Banner";
import BannerRightCard from "@/components/pagesComponents/homeComponents/BannerRightCard";
import BestSalesANdDeal from "@/components/pagesComponents/homeComponents/BestSalesANdDeal";
import FeaturedCategories from "@/components/pagesComponents/homeComponents/FeaturedCategories";
import NewArrivalAddProducts from "@/components/pagesComponents/homeComponents/NewArrivalAddProducts";
import { useEffect } from "react";
import CategoryProducts from "@/components/pagesComponents/homeComponents/CategoryProducts";
import AppleShoppingEvent from "@/components/pagesComponents/homeComponents/OfferBanner";
import Popup from "@/components/pagesComponents/homeComponents/Popup";
import TopSale from "@/components/pagesComponents/homeComponents/TopSale";
import BrandProduct from "@/components/pagesComponents/homeComponents/BrandProduct";
import HomepageDescription from "@/components/pagesComponents/homeComponents/HomepageDescription";
import UpcomingProducts from "@/components/pagesComponents/homeComponents/UpcomingProducts";
import PublicNavigationTop from "@/components/common/shared/PublicNavigationTop";
import SectionWiseProduct from "@/components/pagesComponents/homeComponents/SectionWiseProduct";
import { useGetHomePageDataQuery } from "@/components/store/api/user/userApi";
import { useGetCompanyInfoAllQuery } from "@/components/store/api/company/companyApi";
// import { useGetCompanyInfoAllQuery } from "@/components/store/api/company/companyApi";
// import LoaderSpinner from "@/components/loader/LoaderSpinner";
// import { useSelector } from "react-redux";
// import { selectUser } from "@/components/store/store";
// import DOMPurify from "dompurify";
export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data, isLoading } = useGetHomePageDataQuery({});
  const { data: companyData, isLoading: companyLoading } =
    useGetCompanyInfoAllQuery({});


  return (
    <div className="">
      <div className="bg-secondary ">
        <div className="max-w-[1650px] mx-auto px-1">
          <div className="pb-3 lg:pb-5 max-h-screen">
            <Banner sliders={data?.data?.banners} isLoading={isLoading} />
            <BannerRightCard
              smallbanners={data?.data?.smallBanners}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1650px] mx-auto px-1 lg:px-5">
        <Popup offerData={data?.data?.popups} />
        {/* Shop by category */}
        <FeaturedCategories />
        {/* The deals */}
        <PublicNavigationTop
          banner={companyData}
          bannerLoading={companyLoading}
        />
        <BestSalesANdDeal
          newArivalProducts={data?.data?.dealWiseProducts}
          isLoading={isLoading}
          companyData={companyData}
        />
        {/* Popular product */}
        <AppleShoppingEvent offerData={data?.data?.offerProducts}/>
        <TopSale
          newArivalProducts={data?.data?.popularProducts}
          isLoading={isLoading}
          companyData={companyData}
        />

        <AdvertiseBanner />
        {/* <OfferWiseProduct/> */}
        <AddWIthSliderProducts
          newArivalProducts={data?.data?.offerProducts}
          banner={companyData}
          isLoading={isLoading}
        />
        <NewArrivalAddProducts
          newArivalProducts={data?.data?.newArrivalProducts}
          isLoading={isLoading}
          companyData={companyData}
        />
        <BrandProduct
          BrandProducts={data?.data?.brandWiseProductShow}
          isLoading={isLoading}
          companyData={companyData}
        />
        <SectionWiseProduct sectionWiseProducts={data?.data?.sectionWiseProductShow} isLoading={isLoading} companyData={companyData}/>
        <CategoryProducts categoryProducts={data?.data?.categoryWiseProductShow} isLoading={isLoading} companyData={companyData}/>
        <UpcomingProducts
          productsData={data?.data?.upcomingProducts}
          productLoading={isLoading}
        />
        <HomepageDescription description={companyData} />
      </div>
    </div>
  );
}
