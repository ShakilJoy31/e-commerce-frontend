import ButtonLoader from "@/components/loader/ButtonLoader";
import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/input";
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
import { useToast } from "@/components/ui/use-toast";
import InputWrapper from "@/components/common/wrapper/InputWrapper";
import { Offer } from "./DeliveryCampaignList";

type AddEditOfferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (offer: Offer) => void;
  currentOffer: Offer | undefined;
  loading: boolean;
  err?: any;
};

export default function AddEditCampaignModal({
  isOpen,
  onClose,
  onSave,
  currentOffer,
  loading,
  err,
}: AddEditOfferModalProps) {

  const { toast } = useToast();
  const [amount, setAmount] = useState<number>(0);
  const [file, setFile] = useState<File | undefined>();
  const [startingDate, setStartingDate] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(
    currentOffer?.image || null
  );

  const [error, setError] = useState<string | null>(null);
  const [addThumbnail, { isLoading: addThumbnailLoading }] =
    useAddThumbnailMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Generate preview URL
    }
  };

  useEffect(() => {
    if (currentOffer) {
 
      setAmount(currentOffer.amount || 0);
      setStartingDate(currentOffer.expireDate || "");
    } else {
      setAmount(0);
      setStartingDate("");
    }
    setFile(undefined);
    setError(null);
  }, [currentOffer, isOpen]);

  const handleSave = async () => {
    setError(null);
    if ( !amount || !startingDate) {
      setError("Please fill in all fields.");
      return;
    }

    if (!preview) {
      setError("Please upload an image.");
      return;
    }

    let image = preview; // Use preview as the default image

    // Handle file upload only if a new file is selected
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const uploadResponse = await addThumbnail(formData).unwrap();
        if (uploadResponse?.data) {
          image = uploadResponse.data[0]; // Assuming the response returns an array
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          title: "Error",
          description: "Failed to upload logo. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      onSave({
        id: currentOffer?.id || null,
        amount: amount,
        image, 
        expireDate: startingDate,
      });
    } catch (error) {
      console.error("Error saving offer:", error);
      toast({
        title: "Error",
        description: "Something went wrong! Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full lg:min-w-[600px] overflow-hidden py-10 px-5 h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{currentOffer ? "Edit Offer" : "Add Offer"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5  ">
    

          <div>
            <label htmlFor="">Amount </label>
            <InputField
              type="number"
              placeholder="Enter Amount"
              value={amount.toString()}
              onChange={(e) => {
                setAmount(Number(e.target.value));
                setError(null);
              }}
              errorMessage={error || undefined}
            />
          </div>

          <div>
            <label htmlFor="">Expire Date</label>
            <InputField
              type="date"
              placeholder="Starting Date"
              value={startingDate}
              onChange={(e) => {
                setStartingDate(e.target.value);
                setError(null);
              }}
              errorMessage={error || undefined}
            />
          </div>

          <div>
            <label htmlFor="">Enter offer image (1200 x 600 px)✽</label>
            <InputWrapper label={""}>
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
              <div className="relative w-32 h-32 border rounded-md overflow-hidden mt-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {/* Remove Image Button */}
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
          </div>
        </div>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        {/* Error Alert */}
        {err && "data" in err && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Offer Error</AlertTitle>
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
            disabled={addThumbnailLoading || loading}
          >
            {addThumbnailLoading || loading ? <ButtonLoader /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
