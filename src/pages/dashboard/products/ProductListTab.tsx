import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductList from "./ProductList";
import { useGetProductsQuery } from "@/components/store/api/products/productApi";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import PublishedList from "./PublishedList";
import DraftList from "./DraftList";
import TrashList from "./TrashList";
import UpcomingList from "./UpcomingList";
import ImportProductExcel from "./ImportButton";
import { useState } from "react";
import ProductExcel from "../pdf/ProductExcel";

const ProductListTab = () => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const { data: allProducts, isLoading: allLoading } = useGetProductsQuery({
    sort: "asc",
    page: 1,
    size: 10,
    status: "all",
  }) as any;

  if (allLoading) {
    return <LoaderSpinner />;
  }
  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex items-center gap-2">
          <div>
            <ImportProductExcel />
          </div>
          <div>
            <ProductExcel data={selectedRows} />
          </div>
          <Link to={"/kry-admin-portal/add-product"}>
            <button className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">
              <Plus className="font-bold w-4 h-4" /> Add Product
            </button>
          </Link>
        </div>
      </div>
      <Tabs defaultValue="all" className="mt-5">
        <TabsList className="border">
          <TabsTrigger
            value="all"
            className="text-xl font-semibold px-2 py-1 flex gap-1"
          >
            All{" "}
            <span className="text-primary">
              ({allProducts?.meta?.all || 0})
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="published"
            className="text-xl font-semibold px-2 py-1 flex gap-1"
          >
            Published{" "}
            <span className="text-primary">
              ({allProducts?.meta?.published || 0})
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            className="text-xl font-semibold px-2 py-1 flex gap-1"
          >
            Draft{" "}
            <span className="text-primary">
              ({allProducts?.meta?.draft || 0})
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="text-xl font-semibold px-2 py-1 flex gap-1"
          >
            Upcoming{" "}
            <span className="text-primary">
              ({allProducts?.meta?.upcoming || 0})
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="trash"
            className="text-xl font-semibold px-2 py-1 flex gap-1"
          >
            Trash{" "}
            <span className="text-red-600">
              ({allProducts?.meta?.trust || 0})
            </span>
          </TabsTrigger>
        </TabsList>

        {/* PENDING */}
        <TabsContent value="all">
          <ProductList
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        </TabsContent>

        {/* ACCEPT */}
        <TabsContent value="published">
          <PublishedList
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        </TabsContent>
        <TabsContent value="upcoming">
          <UpcomingList
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        </TabsContent>
        <TabsContent value="draft">
          <DraftList
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        </TabsContent>

        {/* CANCEL */}
        <TabsContent value="trash">
          <TrashList
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ProductListTab;
