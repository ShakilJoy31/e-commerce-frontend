import ButtonLoader from "@/components/loader/ButtonLoader";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
  useDeleteFileMutation,
  useGetGalleryQuery,
} from "@/components/store/api/file/fileApi";
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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FiTrash2, FiSearch } from "react-icons/fi"; // Add FiSearch
import AddGallery from "./AddGallery";
import { useState } from "react";
import "react-image-lightbox/style.css";
import Lightbox from "react-image-lightbox";
import { extractAltText } from "@/utils/helper/extractAltText";
import Paragraph from "@/components/typography/Paragraph";

export function GalleryList() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state
  const { data: galleries, isLoading: galleryLoading } = useGetGalleryQuery({});
  const [deleteGallery, { isLoading: deleteLoading }] = useDeleteFileMutation();

  const handleDeleteGallery = async (alt: string) => {
    try {
      await deleteGallery(alt).unwrap();
      toast({
        title: "Gallery deleted successfully",
        description: "The gallery has been deleted.",
      });
    } catch (err) {
      console.error("Error deleting gallery:", err);
    }
  };

  // Filter galleries based on search term
  const filteredGalleries = galleries?.data?.filter((gallery) => {
    const key = gallery?.key || "";

    // Extract filename from key and remove extension
    const fileName = key
      .split("/")
      .pop()
      ?.replace(/^[\d-]+/, "")
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ")
      .toLowerCase();

    return fileName?.includes(searchTerm.trim().toLowerCase());
  });

  if (galleryLoading) {
    return <LoaderSpinner />;
  }

  return (
    <div>
      <div className="flex justify-between items-center py-5">
        {" "}
        {/* Changed to justify-between */}
        <div className="relative w-full max-w-md">
          {" "}
          {/* Search input container */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search images..."
            className="pl-10 border rounded-md px-3 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="flex justify-start" size="sm">
              Add Gallery
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <AddGallery setModalOpen={setModalOpen} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-5 w-full">
        {filteredGalleries?.length > 0 ? (
          filteredGalleries.map((gallery, index) => (
            <div key={index} className="relative w-full">
              <img
                src={gallery.url}
                alt={gallery.key
                  .split("/")
                  .pop()
                  .replace(/\.[^/.]+$/, "")
                  .replace(/-/g, " ")}
                className="h-40 w-full rounded-lg object-contain cursor-pointer"
                onClick={() => {
                  setIsOpen(true);
                  setPhotoIndex(index);
                }}
              />
              <Paragraph>{extractAltText(gallery.url)}</Paragraph>
              {isOpen && (
                <Lightbox
                  mainSrc={filteredGalleries[photoIndex].url}
                  nextSrc={
                    filteredGalleries[
                      (photoIndex + 1) % filteredGalleries.length
                    ].url
                  }
                  prevSrc={
                    filteredGalleries[
                      (photoIndex + filteredGalleries.length - 1) %
                        filteredGalleries.length
                    ].url
                  }
                  onCloseRequest={() => setIsOpen(false)}
                  onMovePrevRequest={() =>
                    setPhotoIndex(
                      (photoIndex + filteredGalleries.length - 1) %
                        filteredGalleries.length
                    )
                  }
                  onMoveNextRequest={() =>
                    setPhotoIndex((photoIndex + 1) % filteredGalleries.length)
                  }
                />
              )}
              <div className="text-center pt-1">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="text-red-600">
                      <FiTrash2 />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this gallery?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="btn-destructive-fill">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteGallery(gallery.key)}
                      >
                        {deleteLoading && <ButtonLoader />} Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            {searchTerm ? "No matching images found" : "No images available"}
          </div>
        )}
      </div>
    </div>
  );
}
