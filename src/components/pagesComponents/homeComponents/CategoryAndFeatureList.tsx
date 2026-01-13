/* eslint-disable @typescript-eslint/ban-ts-comment */
import PageTransition from "@/components/effects/PageTransition";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Example Data
const featureData = [
  { id: 1, name: "Best Selling" },
  { id: 2, name: "New Arrival" },
  { id: 3, name: "Trending" },
  { id: 4, name: "Friday Fest" },
  { id: 5, name: "Hot Deals" },
  { id: 6, name: "Exclusive Online Deals" },
  { id: 7, name: "GEN-Z Happy Tour" },
  { id: 8, name: "Flash Sales" },
  { id: 9, name: "Deal of the Day" },
  { id: 10, name: "Limited Offers" },
];

const categoryData = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Fashion" },
  { id: 3, name: "Home Appliances" },
  { id: 4, name: "Books" },
  { id: 5, name: "Toys & Games" },
  { id: 6, name: "Beauty & Health" },
  { id: 7, name: "Sports" },
  { id: 8, name: "Groceries" },
  { id: 9, name: "Fitness" },
  { id: 10, name: "Jewelry" },
];

export default function CategoryAndFeatureList() {
  const ITEMS_PER_PAGE = 8; // Total items to show per section

  const [featurePage, setFeaturePage] = useState(0);
  const [categoryPage, setCategoryPage] = useState(0);
  //@ts-ignore
  const handleNext = (currentPage, dataLength, setPage) => {
    setPage((prev) =>
      prev < Math.ceil(dataLength / ITEMS_PER_PAGE) - 1 ? prev + 1 : 0
    );
  };
  //@ts-ignore
  const handlePrev = (currentPage, dataLength, setPage) => {
    setPage((prev) =>
      prev > 0 ? prev - 1 : Math.ceil(dataLength / ITEMS_PER_PAGE) - 1
    );
  };

  const currentFeatureData = featureData.slice(
    featurePage * ITEMS_PER_PAGE,
    (featurePage + 1) * ITEMS_PER_PAGE
  );

  const currentCategoryData = categoryData.slice(
    categoryPage * ITEMS_PER_PAGE,
    (categoryPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Feature List Section */}
      <div className="col-span-12 lg:col-span-6 bg-white shadow-lg p-6 rounded">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Feature List</h3>
          <div className="flex gap-2">
            <button
              onClick={() =>
                handlePrev(featurePage, featureData.length, setFeaturePage)
              }
            >
              <IoIosArrowBack className="text-lg cursor-pointer" />
            </button>
            <button
              onClick={() =>
                handleNext(featurePage, featureData.length, setFeaturePage)
              }
            >
              <IoIosArrowForward className="text-lg cursor-pointer" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentFeatureData.map((feature) => (
            <PageTransition key={feature.id} variant="fade">
              <div className="py-7 px-4 bg-gray-200 hover:bg-gray-300 transition text-center font-medium cursor-pointer">
                {feature.name}
              </div>
            </PageTransition>
          ))}
        </div>
      </div>

      {/* Category List Section */}
      <div className="col-span-12 lg:col-span-6 bg-white shadow-lg p-6 rounded">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Category List</h3>
          <div className="flex gap-2">
            <button
              onClick={() =>
                handlePrev(categoryPage, categoryData.length, setCategoryPage)
              }
            >
              <IoIosArrowBack className="text-lg cursor-pointer" />
            </button>
            <button
              onClick={() =>
                handleNext(categoryPage, categoryData.length, setCategoryPage)
              }
            >
              <IoIosArrowForward className="text-lg cursor-pointer" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentCategoryData.map((category) => (
            <PageTransition key={category.id} variant="fade">
              <div className="py-7 px-4 bg-gray-200 hover:bg-gray-300 transition text-center font-medium cursor-pointer">
                {category.name}
              </div>
            </PageTransition>
          ))}
        </div>
      </div>
    </div>
  );
}
