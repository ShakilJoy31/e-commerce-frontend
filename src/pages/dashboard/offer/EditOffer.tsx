import ButtonLoader from "@/components/loader/ButtonLoader";
import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, XCircle } from "lucide-react";
import InputWrapper from "@/components/common/wrapper/InputWrapper";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { MyCustomUploadAdapterPlugin } from "../products/MyCustomImUploadAdapter";
import Input from "@/components/ui/input";
import {
  useGetOfferByIdQuery,
  useUpdateOfferMutation,
} from "@/components/store/api/products/offerApi";
import toast from "react-hot-toast";
import Heading from "@/components/typography/Heading";
import { removeFalsyValuesProperties } from "@/utils/helper/removeFalsyValuesProperties";
import { useParams } from "react-router-dom";
import LoaderSpinner from "@/components/loader/LoaderSpinner";

const formatForInput = (dateString: string | Date | null): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const pad = (num: number) => num.toString().padStart(2, "0");

  // Format without seconds for display
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const parseInputValue = (value: string): string => {
  if (!value) return "";

  // Create new date object and manually set seconds to 00
  const [datePart, timePart] = value.split('T');
  const [hours, minutes] = timePart?.split(':') || ['00', '00'];
  
  const date = new Date(`${datePart}T${hours}:${minutes}:00`);
  if (isNaN(date.getTime())) return "";

  return date.toISOString();
};

export default function EditOffer() {
  const { link } = useParams();

  const [offerName, setOfferName] = useState<string>("");
  const [subTitle, setSubTitle] = useState<string>("");
  const { data: singleOffer, isLoading: singleOfferLoading } =
    useGetOfferByIdQuery(link);
  const [updateOffer, { isLoading: editLoading, error: editError }] =
    useUpdateOfferMutation();
  const [altText, setAltText] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [offerType, setOfferType] = useState<"Online" | "Outlet">("Online");
  const [file, setFile] = useState<File | undefined>();
  const [description, setDescription] = useState<string>("");
  const [condition, setCondition] = useState<string>("");
   const [startingDateTime, setStartingDateTime] = useState<string>("");
    const [expiryDateTime, setExpiryDateTime] = useState<string>("");
  
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [addThumbnail, { isLoading: addThumbnailLoading }] =
    useAddThumbnailMutation();

  useEffect(() => {
    if (singleOffer?.data) {
      const offer = singleOffer.data;
      setOfferName(offer.offerName || "");
      setSubTitle(offer.subTitle || "");
      setDiscount(offer.discount || 0);
      setOfferType(offer.offerType || "Online");
      setStartingDateTime(offer?.startingDate || "")
      setExpiryDateTime(offer?.expiryDate || "")
      setDescription(offer.description || "");
      setCondition(offer.condition || "");
      setPreview(offer.image || null);
      setAltText(offer.imageAltText || "");
    }
  }, [singleOffer]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const startingDateTimeInputValue = formatForInput(startingDateTime);
  const expiryDateTimeInputValue = formatForInput(expiryDateTime);

    const handleDateTimeChange = (type: "start" | "end", value: string) => {
    const isoString = parseInputValue(value);
    if (type === "start") {
      setStartingDateTime(isoString);
    } else {
      setExpiryDateTime(isoString);
    }
    setError(null);
  };

  const handleSave = async () => {
    setError(null);

    if (
      !offerName ||
      !startingDateTime ||
      !expiryDateTime ||
      !offerType
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!preview) {
      setError("Please upload an image.");
      return;
    }

    // Parse the datetime strings
    const startDate = new Date(startingDateTime);
    const endDate = new Date(expiryDateTime);

    // Validate end date is after start date
    if (endDate <= startDate) {
      setError("End date/time must be after start date/time");
      return;
    }
    
    let image = preview;

    // Handle file upload if a new file is selected
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      if (altText) formData.append("alt", altText);

      try {
        const uploadResponse = await addThumbnail(formData).unwrap();
        if (uploadResponse?.data) {
          image = uploadResponse.data[0];
        }
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to upload image");
        return;
      }
    }

    try {
      const offerData = {
        offerName,
        subTitle,
        discountType: "FIXED",
        offerType,
        discount,
        image,
        startingDate: startingDateTime,
        expiryDate: expiryDateTime,
        description,
        condition,
      };

      const cleanData = removeFalsyValuesProperties(offerData, [
        "subTitle",
        "description",
        "condition",
      ]);

      const result = await updateOffer({
        id: singleOffer?.data?.id,
        data: cleanData,
      }).unwrap();

      if (result.success) {
        toast.success("Offer updated successfully!");
        // Optionally navigate away or reset if needed
      }
    } catch (error: any) {
      console.error("Error updating offer:", error);
      toast.error(
        error?.data?.message || "Failed to update offer. Please try again."
      );
    }
  };

  if (singleOfferLoading) {
    return <LoaderSpinner />;
  }

  return (
    <div>
      <div className="w-full lg:min-w-[1000px] overflow-hidden py-10 px-5 overflow-y-auto">
        <div>
          <div className="py-5">
            <Heading variant="primary">Update Offer</Heading>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label htmlFor="">Offer Name ✽</label>
            <InputField
              type="text"
              placeholder="Enter Offer Name"
              value={offerName}
              onChange={(e) => {
                setOfferName(e.target.value);
                setError(null);
              }}
              errorMessage={error || undefined}
            />
          </div>

          <div>
            <label htmlFor="">Offer Subtitle</label>
            <InputField
              type="text"
              placeholder="Enter Subtitle (Optional)"
              value={subTitle}
              onChange={(e) => {
                setSubTitle(e.target.value);
                setError(null);
              }}
              errorMessage={error || undefined}
            />
          </div>

          {/* <div>
            <label htmlFor="">Select Discount Type ✽</label>
            <Select
              value={discountType}
              onValueChange={(value) => {
                setDiscountType(value as "FIXED" | "PERCENTAGE");
                setError(null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Discount Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIXED">Fixed</SelectItem>
                <SelectItem value="PERCENTAGE">Percentage</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          <div>
            <label htmlFor="">Offer Type ✽</label>
            <Select
              value={offerType}
              onValueChange={(value) => {
                setOfferType(value as "Online" | "Outlet");
                setError(null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Offer Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Outlet">Outlet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="">Discount amount ✽</label>
            <InputField
              type="number"
              placeholder="Enter Discount Amount"
              value={discount.toString()}
              onChange={(e) => {
                setDiscount(Number(e.target.value));
                setError(null);
              }}
              errorMessage={error || undefined}
            />
          </div>

           <div>
            <label htmlFor="startingDateTime">Start Date/Time ✽</label>
            <input
              type="datetime-local"
              step="1"
              id="startingDateTime"
              value={startingDateTimeInputValue}
              onChange={(e) => handleDateTimeChange("start", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="expiryDateTime">End Date/Time ✽</label>
            <input
              type="datetime-local"
              step="1"
              id="expiryDateTime"
              value={expiryDateTimeInputValue}
              onChange={(e) => handleDateTimeChange("end", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="">
            <div>
              <label htmlFor="">Offer Image ✽</label>
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
            </div>

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

            <div className="p-2 col-span-1">
              <label htmlFor="">Alt text</label>
              <Input
                placeholder="Enter alt text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <label htmlFor="">Description</label>
            <CKEditor
              // @ts-ignore
              editor={ClassicEditor}
              data={description || ""}
              config={{
                toolbar: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "link",
                  "bulletedList",
                  "numberedList",
                  "blockQuote",
                  "|",
                  "imageUpload",
                  "undo",
                  "redo",
                  "alignment",
                ],
                extraPlugins: [MyCustomUploadAdapterPlugin],
                heading: {
                  options: [
                    {
                      model: "paragraph",
                      title: "Paragraph",
                      class: "ck-heading_paragraph",
                    },
                    {
                      model: "heading1",
                      view: "h1",
                      title: "Heading 1",
                      class: "ck-heading_heading1",
                    },
                    {
                      model: "heading2",
                      view: "h2",
                      title: "Heading 2",
                      class: "ck-heading_heading2",
                    },
                    {
                      model: "heading3",
                      view: "h3",
                      title: "Heading 3",
                      class: "ck-heading_heading3",
                    },
                    {
                      model: "heading4",
                      view: "h4",
                      title: "Heading 4",
                      class: "ck-heading_heading4",
                    },
                    {
                      model: "heading5",
                      view: "h5",
                      title: "Heading 5",
                      class: "ck-heading_heading5",
                    },
                    {
                      model: "heading6",
                      view: "h6",
                      title: "Heading 6",
                      class: "ck-heading_heading6",
                    },
                  ],
                },
              }}
              onChange={(_, editor) => {
                setDescription(editor.getData());
              }}
            />
          </div>

          <div>
            <label htmlFor="">Condition</label>
            <CKEditor
              // @ts-ignore
              editor={ClassicEditor}
              data={condition || ""}
              config={{
                toolbar: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "link",
                  "bulletedList",
                  "numberedList",
                  "blockQuote",
                  "|",
                  "imageUpload",
                  "undo",
                  "redo",
                  "alignment",
                ],
                extraPlugins: [MyCustomUploadAdapterPlugin],
                heading: {
                  options: [
                    {
                      model: "paragraph",
                      title: "Paragraph",
                      class: "ck-heading_paragraph",
                    },
                    {
                      model: "heading1",
                      view: "h1",
                      title: "Heading 1",
                      class: "ck-heading_heading1",
                    },
                    {
                      model: "heading2",
                      view: "h2",
                      title: "Heading 2",
                      class: "ck-heading_heading2",
                    },
                    {
                      model: "heading3",
                      view: "h3",
                      title: "Heading 3",
                      class: "ck-heading_heading3",
                    },
                    {
                      model: "heading4",
                      view: "h4",
                      title: "Heading 4",
                      class: "ck-heading_heading4",
                    },
                    {
                      model: "heading5",
                      view: "h5",
                      title: "Heading 5",
                      class: "ck-heading_heading5",
                    },
                    {
                      model: "heading6",
                      view: "h6",
                      title: "Heading 6",
                      class: "ck-heading_heading6",
                    },
                  ],
                },
              }}
              onChange={(_, editor) => {
                setCondition(editor.getData());
              }}
            />
          </div>
        </div>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        {/* Error Alert */}
        {editError && "data" in editError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Offer Error</AlertTitle>
            <AlertDescription>
              {(editError.data as { message?: string })?.message ||
                "Something went wrong! Please try again."}
            </AlertDescription>
          </Alert>
        )}
        <div className="my-10 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={addThumbnailLoading || editLoading}
          >
            {addThumbnailLoading || editLoading ? <ButtonLoader /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
