import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, XCircle } from "lucide-react";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { useToast } from "@/components/ui/use-toast";
import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";
import InputWrapper from "@/components/common/wrapper/InputWrapper";
import Input from "@/components/ui/input";

interface AddEditGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    id: number | null,
    name: string,
    image: string,
    quantity: number
  ) => void;
  currentGift?: {
    id: number | null;
    name: string;
    image: string;
    quantity: number;
  };
  loading: boolean;
  err?: any;
}

export default function AddEditGiftModal({
  isOpen,
  onClose,
  onSave,
  currentGift,
  loading,
  err,
}: AddEditGiftModalProps) {
  const [name, setName] = useState(currentGift?.name || "");
  const [quantity, setQuantity] = useState(currentGift?.quantity || 0);
  const [error, setError] = useState<string | null>(null);
   const [altText, setAltText] = useState("");
  const [preview, setPreview] = useState<string | null>(
    currentGift?.image || null
  );
  const [file, setFile] = useState<File | undefined>();
  const { toast } = useToast();

  const [addThumbnail, { isLoading: addThumbnailLoading }] =
    useAddThumbnailMutation();

  useEffect(() => {
    setName(currentGift?.name || "");
    setQuantity(currentGift?.quantity || 0);
    setPreview(currentGift?.image || null);
    setError(null);
  }, [currentGift]);

 const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    if (name.trim() === "") {
      setError("Gift name cannot be empty");
      return;
    }
    let uploadedImage = preview || "";
    if (file) {
      try {
        const formData = new FormData();
        formData.append("image", file);
        if (altText) {
        formData.append("alt", altText);
      }
        const response = await addThumbnail(formData).unwrap();
        
        uploadedImage = response.data[0];
      } catch (error) {
        console.error("Image upload error:", error);
        toast({
          title: "Image Upload Error",
          description: "Failed to upload image. Try again.",
          variant: "destructive",
        });
        return;
      }
    }
    try {
      onSave(currentGift?.id || null, name.trim(), uploadedImage, quantity);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong! Please try again.",
        variant: "destructive",
      });
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{currentGift ? "Edit Gift" : "Add Gift"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <InputField
            type="text"
            placeholder="Enter Gift Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            errorMessage={error || undefined}
          />
          <InputField
            type="number"
            placeholder="Enter Gift Quantity"
            value={String(quantity)}
            onChange={(e) => {
              setQuantity(Number(e.target.value));
              setError(null);
            }}
            errorMessage={error || undefined}
          />
          <InputWrapper label={""}>
            <label htmlFor="" className="block mb-1">
              Upload category logo<span className="text-red-600">✽</span>
            </label>
            <div className="border-2 border-dashed rounded-md py-3 px-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </InputWrapper>
          {preview && (
            <div className="relative w-32 h-32 border rounded-md overflow-hidden mt-2">
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

          <div className="p-2 col-span-1">
            <label htmlFor="">Alt text</label>
            <Input
              placeholder="Enter alt text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>
        </div>
        {err && "data" in err && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Gift Error</AlertTitle>
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
            disabled={!name.trim()}
          >
            {loading || (addThumbnailLoading && <ButtonLoader />)} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
