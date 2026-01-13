import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
// import { useGetPagesQuery } from "@/components/store/api/pages/pageApi";
// import PageList from "./PageList";
import PublishedPageList from "./PublishedPageList";
import DraftPageList from "./DraftPageList";
import TrashPageList from "./TrashPageList";

const PageListTab = () => {
//   const { data: allProducts, isLoading: allLoading } = useGetPagesQuery({
//     sort: "asc",
//     page: 1,
//     size: 10,
//     status: "all",
//   }) as any;


//   if (allLoading) {
//     return <LoaderSpinner />;
//   }
  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">Pages</h1>
        <div className="flex items-center gap-2">
          <button className="px-4 py-1 font-semibold rounded border text-blue-500 mr-2">
            Export
          </button>
          <Link to={"/kry-admin-portal/add-new-pages"}>
            <button className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">
              <Plus className="font-bold w-4 h-4" /> Add Page
            </button>
          </Link>
        </div>
      </div>
      <Tabs defaultValue="published" className="mt-5">
        <TabsList className="border">
          {/* <TabsTrigger
            value="all"
            className="text-xl font-semibold px-2 py-1 flex gap-1"
          >
            All{" "}
            <span className="text-primary">
              ({allProducts?.meta?.all || 0})
            </span>
          </TabsTrigger> */}
          <TabsTrigger
            value="published"
            className="text-xl font-semibold px-2 py-1 flex gap-1"
          >
            Published{" "}
            {/* <span className="text-primary">
              ({allProducts?.meta?.published || 0})
            </span> */}
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            className="text-xl font-semibold px-2 py-1 flex gap-1"
          >
            Draft{" "}
            {/* <span className="text-primary">
              ({allProducts?.meta?.draft || 0})
            </span> */}
          </TabsTrigger>
        
          <TabsTrigger
            value="trash"
            className="text-xl font-semibold px-2 py-1 flex gap-1"
          >
            Trash{" "}
            {/* <span className="text-red-600">
              ({allProducts?.meta?.trust || 0})
            </span> */}
          </TabsTrigger>
        </TabsList>

        {/* PENDING */}
        {/* <TabsContent value="all">
          <PageList />
        </TabsContent> */}

        {/* ACCEPT */}
        <TabsContent value="published">
          <PublishedPageList />
        </TabsContent>
        <TabsContent value="draft">
          <DraftPageList />
        </TabsContent>

        {/* CANCEL */}
        <TabsContent value="trash">
            <TrashPageList/>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default PageListTab;
