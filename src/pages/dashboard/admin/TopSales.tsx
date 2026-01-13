import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const salesData = [
  {
    id: 1,
    name: "Samsung S24 Special",
    price: "65,000 ৳",
    sales: "75 Sales",
    image: "https://via.placeholder.com/50x50", // Replace with actual image URLs
  },
  {
    id: 2,
    name: "Samsung S24 Special",
    price: "65,000 ৳",
    sales: "75 Sales",
    image: "https://via.placeholder.com/50x50",
  },
  {
    id: 3,
    name: "Samsung S24 Special",
    price: "65,000 ৳",
    sales: "75 Sales",
    image: "https://via.placeholder.com/50x50",
  },
  {
    id: 4,
    name: "Samsung S24 Special",
    price: "65,000 ৳",
    sales: "75 Sales",
    image: "https://via.placeholder.com/50x50",
  },
  {
    id: 5,
    name: "Samsung S24 Special",
    price: "65,000 ৳",
    sales: "75 Sales",
    image: "https://via.placeholder.com/50x50",
  },
];

export default function TopSales() {
  const [selectedFilter, setSelectedFilter] = useState("Weekly");

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Top Sales</h3>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="text-sm text-gray-600 flex items-center">
              {selectedFilter}
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32">
            <DropdownMenuItem onClick={() => handleFilterChange("Daily")}>
              Daily
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange("Weekly")}>
              Weekly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange("Monthly")}>
              Monthly
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sales List */}
      <ul className="space-y-4">
        {salesData.map((item) => (
          <li key={item.id} className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Product Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-md mr-4"
              />
              {/* Product Info */}
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">{item.price}</p>
              </div>
            </div>
            <p className="text-sm font-semibold">{item.sales}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
