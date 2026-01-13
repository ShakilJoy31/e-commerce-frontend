/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  useAddCompanyMutation,
  useGetSingleCompanyQuery,
  useUpdateCompanyMutation,
} from "@/components/store/api/company/companyApi";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { companySchema } from "@/schemas/company/companySchema";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { MyCustomUploadAdapterPlugin } from "../products/MyCustomImUploadAdapter";
import InputWrapper from "@/components/common/wrapper/InputWrapper";
import { removeFalsyValuesProperties } from "@/utils/helper/removeFalsyValuesProperties";

interface CompanyInfo {
  companyName: string;
  logo: string | File;
  footerLogo: string | File;
  bannerOne: string | File;
  bannerTwo: string | File;
  address: string;
  phone: string;
  phone2: string;
  email: string;
  homePageDescription: string;
  exchangePolicy: string;
  returnPolicy: string;
}

export default function AddEditCompany() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState<{
    id: number;
    title: string;
    description: string;
    type: "success" | "error";
  } | null>(null);

  const [addCompany, { isLoading: isAdding }] = useAddCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();
  const [addThumbnail, { isLoading: isUploadingImage }] =
    useAddThumbnailMutation();
  const { data: companyData, isLoading: isFetching } = useGetSingleCompanyQuery(
    id,
    { skip: !id }
  );

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyName: "",
    logo: "",
    footerLogo: "",
    bannerOne: "",
    bannerTwo: "",
    address: "",
    phone: "",
    phone2: "",
    email: "",
    homePageDescription: "",
    exchangePolicy: "",
    returnPolicy: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<Partial<CompanyInfo>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (companyData) {
      //@ts-ignore
      const { id, createdAt, updatedAt, ...data } = companyData.data;
      setCompanyInfo(data);
    }
  }, [companyData]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof CompanyInfo
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFiles((prev) => ({ ...prev, [field]: file }));
      setCompanyInfo((prev) => ({ ...prev, [field]: file }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    const uploadFields: (keyof CompanyInfo)[] = [
      "logo",
      "footerLogo",
      "bannerOne",
      "bannerTwo",
    ];

    try {
      // Validate the form using Zod
      companySchema.parse({
        ...companyInfo,
        ...uploadedFiles,
      });
    } catch (validationError: any) {
      if (validationError.errors) {
        const validationErrors: Record<string, string> = {};
        validationError.errors.forEach((err: z.ZodIssue) => {
          validationErrors[err.path[0] as string] = err.message;
        });
        setErrors(validationErrors);
      }
      return;
    }

    const uploadedUrls: Partial<CompanyInfo> = {};

    // Upload files and get URLs
    for (const field of uploadFields) {
      if (uploadedFiles[field]) {
        const formData = new FormData();
        formData.append("image", uploadedFiles[field] as File);
        try {
          const response = await addThumbnail(formData).unwrap();
          uploadedUrls[field] = response?.data[0];
          //@ts-ignore
        } catch (error) {
          console.error("Error uploading image:", error);
          setToastMessage({
            id: Date.now(),
            title: "Upload Error",
            description: `Failed to upload ${field}. Please try again.`,
            type: "error",
          });
          return;
        }
      }
    }
    //@ts-ignore
    const { createdAt, updatedAt, ...finalData } = {
      ...companyInfo,
      ...uploadedUrls,
    };

    const removeNulish=removeFalsyValuesProperties(finalData, ["homePageDescription", "returnPolicy", "exchangePolicy"])

    try {
      const apiCall = id ? updateCompany : addCompany;

      if (id) {
        await apiCall({ id, data: removeNulish }).unwrap();
      } else {
        await apiCall(removeNulish).unwrap();
      }

      setToastMessage({
        id: Date.now(),
        title: "Success",
        description: `Company info ${id ? "updated" : "added"} successfully.`,
        type: "success",
      });
      navigate("/admin/company-info");
    } catch (error: any) {
      console.error("Error saving company info:", error);
      setToastMessage({
        id: Date.now(),
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    }
  };

  if (isFetching) return <div>Loading...</div>;

  const renderFieldError = (field: keyof CompanyInfo) =>
    errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>;

  return (
    <ToastProvider>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            {id ? "Edit Company Info" : "Add Company Info"}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
          >
            &larr; Back
          </button>
        </div>
        <div className="bg-white shadow rounded-lg p-6 space-y-4 flex flex-wrap gap-3">
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={companyInfo.companyName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          {renderFieldError("companyName")}
          {["logo", "footerLogo"].map((field) => (
            <div key={field}>
             <label>{field} (PNG only, 120x40px recommended)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(e, field as keyof CompanyInfo)
                }
                className="w-full px-3 py-2 border rounded"
              />
              {companyInfo[field] && (
                <img
                  src={
                    companyInfo[field] instanceof File
                      ? URL.createObjectURL(companyInfo[field] as File)
                      : (companyInfo[field] as string)
                  }
                  alt={field}
                  className="mt-2 w-32"
                />
              )}
              {renderFieldError(field as keyof CompanyInfo)}
            </div>
          ))}
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={companyInfo.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          {renderFieldError("address")}
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={companyInfo.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="phone2"
            placeholder="Phone two"
            value={companyInfo.phone2}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          {renderFieldError("phone2")}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={companyInfo.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          {["bannerOne", "bannerTwo"].map((field) => (
          <div key={field}>
            <label>{field}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, field as keyof CompanyInfo)}
              className="w-full px-3 py-2 border rounded"
            />
            {companyInfo[field] && (
              <img
                src={
                  companyInfo[field] instanceof File
                    ? URL.createObjectURL(companyInfo[field] as File)
                    : (companyInfo[field] as string)
                }
                alt={field}
                className="mt-2 w-32"
              />
            )}
            {renderFieldError(field as keyof CompanyInfo)}
          </div>
        ))}
          {renderFieldError("email")}
          <InputWrapper label="Home Page Description">
            {/* PRODUCT DESCRIPTION */}
            <CKEditor
              // @ts-ignore
              editor={ClassicEditor}
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
              data={companyInfo.homePageDescription || ""} // ✅ Set initial value
              onChange={(_, editor) => {
                const data = editor.getData();
                setCompanyInfo((prev) => ({
                  ...prev,
                  homePageDescription: data,
                })); // ✅ Update state
                setErrors((prev) => ({ ...prev, homePageDescription: "" })); // ✅ Clear errors on change
              }}
            />
            {errors.homePageDescription && (
              <p className="text-red-500 text-sm">
                {errors.homePageDescription}
              </p>
            )}
          </InputWrapper>
          <InputWrapper label="Exchange Policy">
            {/* PRODUCT DESCRIPTION */}
            <CKEditor
              // @ts-ignore
              editor={ClassicEditor}
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
              data={companyInfo.exchangePolicy || ""} // ✅ Set initial value
              onChange={(_, editor) => {
                const data = editor.getData();
                setCompanyInfo((prev) => ({
                  ...prev,
                  exchangePolicy: data,
                })); // ✅ Update state
                setErrors((prev) => ({ ...prev, exchangePolicy: "" })); // ✅ Clear errors on change
              }}
            />
            {errors.exchangePolicy && (
              <p className="text-red-500 text-sm">{errors.exchangePolicy}</p>
            )}
          </InputWrapper>
          <InputWrapper label="Return Policy">
            {/* PRODUCT DESCRIPTION */}
            <CKEditor
              // @ts-ignore
              editor={ClassicEditor}
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
              data={companyInfo.returnPolicy || ""} // ✅ Set initial value
              onChange={(_, editor) => {
                const data = editor.getData();
                setCompanyInfo((prev) => ({
                  ...prev,
                  returnPolicy: data,
                })); // ✅ Update state
                setErrors((prev) => ({ ...prev, returnPolicy: "" })); // ✅ Clear errors on change
              }}
            />
            {errors.returnPolicy && (
              <p className="text-red-500 text-sm">{errors.returnPolicy}</p>
            )}
          </InputWrapper>
          <button
            onClick={handleSubmit}
            disabled={isAdding || isUpdating || isUploadingImage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          >
            {isUploadingImage
              ? "Uploading Images..."
              : isAdding || isUpdating
              ? "Saving..."
              : id
              ? "Update"
              : "Add"}
          </button>
        </div>
        {toastMessage && (
          <Toast
            key={toastMessage.id}
            variant={
              toastMessage.type === "success" ? "default" : "destructive"
            }
          >
            <ToastTitle>{toastMessage.title}</ToastTitle>
            <ToastDescription>{toastMessage.description}</ToastDescription>
            <ToastClose />
          </Toast>
        )}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}
