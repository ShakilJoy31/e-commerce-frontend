import InputWrapper from "@/components/common/wrapper/InputWrapper";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, XCircle } from "lucide-react";
import Input from "@/components/ui/input";

interface AddEditBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bannerId: number | null, data: { image: string; link?: string }) => void;
  currentBanner?: { bannerId: number | null; image?: string; link?: string };
  loading: boolean;
  err?: any;
}

export default function AddEditSmallBannerModal({
  isOpen,
  onClose,
  onSave,
  currentBanner,
  loading,
  err,
}: AddEditBannerModalProps) {
  const [file, setFile] = useState<File | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [link, setLink] = useState("");
  const [addThumbnail, { isLoading: addThumbnailLoading }] =
    useAddThumbnailMutation();

  // Reset form when modal opens or currentBanner changes
  useEffect(() => {
    if (currentBanner) {
      setPreview(currentBanner.image || null);
      setLink(currentBanner.link || "");
    } else {
      setPreview(null);
      setLink("");
    }
    setError(null);
  }, [currentBanner, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError("Please upload an image file");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleSave = async () => {
    setError(null);

    // Validation
    if (!file && !preview) {
      setError("Please upload an image");
      return;
    }

    let image = preview || "";

    // Upload new image if needed
    if (file && (!preview || preview.startsWith("blob:"))) {
      try {
        const formData = new FormData();
        formData.append("image", file);
        if (altText) {
          formData.append("alt", altText);
        }

        const uploadResponse = await addThumbnail(formData).unwrap();

        if (uploadResponse?.data) {
          image = Array.isArray(uploadResponse.data) 
            ? uploadResponse.data[0]
            : uploadResponse.data;
        }
      } catch (err) {
        console.error("Error uploading file:", err);
        setError("Failed to upload image. Please try again.");
        return;
      }
    }

    // Prepare the final payload
    const payload = {
      image: image,
      link: link.trim() || undefined 
    };

    // console.log("small",payload)

    onSave(currentBanner?.bannerId || null, payload);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentBanner ? "Edit Side Slider" : "Add Side Slider"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Link Input */}
          <InputWrapper label="Link (optional)">
            <Input
              type="text"
              placeholder="Enter link (e.g., /products)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </InputWrapper>

          {/* File Upload */}
          <InputWrapper label="Upload a logo">
            <div className="border-2 border-dashed rounded-md py-3 px-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              />
            </div>
          </InputWrapper>

          {/* Image Preview */}
          {preview && (
            <div className="relative w-full h-40 border rounded-md overflow-hidden mt-2">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                onClick={() => {
                  setPreview(null);
                  setFile(undefined);
                }}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Alt Text */}
          <div className="p-2">
            <label htmlFor="">Alt text</label>
            <Input
              placeholder="Enter alt text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* API Error Display */}
        {err && "data" in err && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Side Slider Error</AlertTitle>
            <AlertDescription>
              {(err.data as { message?: string })?.message ||
                "Something went wrong! Please try again."}
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-500 text-white"
            disabled={addThumbnailLoading || loading}
          >
            {addThumbnailLoading || loading ? <ButtonLoader /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}