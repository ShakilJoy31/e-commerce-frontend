import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import {
  BlogFormData,
  blogSchema,
} from "@/schemas/blogPostSchema/blogPostSchema";
import InputWrapper from "@/components/common/wrapper/InputWrapper";
import TextArea from "@/components/ui/text-area";
import Input from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAddPostMutation } from "@/components/store/api/blogPost/blogPostApi";
import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";
import { useGetBlogTagsQuery } from "@/components/store/api/blogTags/blogTagsApi";
import { useGetBlogCategoriesQuery } from "@/components/store/api/blogCategory/blogCategoryApi";
// import { capitalizeEveryWord } from "@/utils/helper/capitalizeEveryWord";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { XCircle } from "lucide-react";
import DraftEditor from "@/components/common/draftEditor/DraftEditor";
import SearchableSelect from "../products/SearchableSelect";

interface BlogFormProps {
  onSuccess: () => void;
}

const BlogFormModal = ({ onSuccess }: BlogFormProps) => {
  const { toast } = useToast();
  const [addPost, { isLoading: postLoading }] = useAddPostMutation();
  const [addThumbnail, { isLoading: uploadLoading }] =
    useAddThumbnailMutation();

  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | undefined>(
    undefined
  );
  const [ , setSearchQuery] = useState({ category: "", tag: "" });
  // const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: categoryList, isLoading: categoryLoading } =
    useGetBlogCategoriesQuery({});
  const {  isLoading: tagLoading } = useGetBlogTagsQuery({});

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    setError,
  } = useForm<BlogFormData>({
    resolver: yupResolver(blogSchema),
    defaultValues: {
      status: "Published",
      title: "",
      author: "",
      categoryId: undefined,
      tagId: undefined,
      content: "",
      image: "",
      seoTitle: "",
      seoDescription: "",
      alt: "",
    },
  });

  // const handleSearchChange = (type: "category" | "tag", value: string) => {
  //   setSearchQuery((prev) => ({ ...prev, [type]: value }));
  // };

  // const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Escape") {
  //     setSearchQuery({ category: "", tag: "" });
  //   }
  // };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setUploadedImage(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleReset = () => {
    reset();
    setPreview(null);
    setUploadedImage(undefined);
    setSearchQuery({ category: "", tag: "" });
    onSuccess();
  };

  const onSubmit = async (data: BlogFormData) => {
    try {
      let imageUrl = data.image || "";

      // Upload image if new file was selected
      if (uploadedImage) {
        try {
          const formData = new FormData();
          formData.append("image", uploadedImage);

          // Only include alt if it exists
          if (data.alt) {
            formData.append("alt", data.alt);
          }

          const response = await addThumbnail(formData).unwrap();
          imageUrl = response?.data?.[0] || "";
        } catch (err) {
          console.error(err);
          toast({
            title: "Image Upload Error",
            description: "Failed to upload thumbnail image",
            variant: "destructive",
          });
          return;
        }
      }

      // Create payload without the alt field if it's empty or not needed
      const payload = {
        status: data.status,
        title: data.title,
        author: data.author,
        categoryId: data.categoryId,
        tagId: data.tagId,
        content: data.content,
        image: imageUrl,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        // Explicitly omit the alt field since backend doesn't accept it
      };

      await addPost(payload).unwrap();

      toast({
        title: "Success",
        description: "Blog post created successfully",
      });

      handleReset();
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.data?.message || err?.message || "Failed to create blog post",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Status Select */}
        <InputWrapper
          label="Status"
          labelFor="status"
          error={errors.status?.message}
        >
          <Select
            value={watch("status")}
            onValueChange={(val: "Draft" | "Published" | "Trust") => {
              setValue("status", val);
              setError("status", { type: "custom", message: "" });
            }}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Trust">Trust</SelectItem>
            </SelectContent>
          </Select>
        </InputWrapper>

        {/* Title */}
        <InputWrapper
          label="Title"
          labelFor="title"
          error={errors.title?.message}
        >
          <Input
            placeholder="Enter blog title"
            value={watch("title")}
            onChange={(e) => setValue("title", e.target.value)}
            errorMessage={errors.title?.message}
          />
        </InputWrapper>

        {/* Author */}
        <InputWrapper
          label="Author"
          labelFor="author"
          error={errors.author?.message}
        >
          <Input
            placeholder="Enter author name"
            value={watch("author")}
            onChange={(e) => setValue("author", e.target.value)}
            errorMessage={errors.author?.message}
          />
        </InputWrapper>

        {/* Category */}
        <InputWrapper
          label="Category"
          labelFor="category"
          error={errors.categoryId?.message}
        >
         <SearchableSelect
                label="Category"
                labelFor="product_category"
                value={watch("categoryId")?.toString()}
                onValueChange={(value) => {
                  setValue("categoryId", +value);
                  setError("categoryId", { type: "custom", message: "" });
                }}
                options={categoryList?.data ?? []}
                error={errors?.categoryId?.message}
                loading={categoryLoading}
                labelKey="name"
              />
        </InputWrapper>

        {/* Tag Select */}
        
           <InputWrapper
              label="Tag"
              labelFor="tag"
              error={errors.tagId?.message}
            >
              <SearchableSelect
              label="Tag"
              labelFor="product_tag"
              value={watch("tagId")?.toString()}
              onValueChange={(value) => {
                setValue("tagId", +value);
                setError("tagId", { type: "custom", message: "" });
              }}
              options={categoryList?.data ?? []}
              error={errors?.categoryId?.message}
              loading={tagLoading}
              labelKey="name"
            />
            </InputWrapper>

        {/* SEO Title */}
        <InputWrapper
          label="SEO Title"
          labelFor="seoTitle"
          error={errors.seoTitle?.message}
        >
          <Input
            placeholder="Enter SEO title"
            value={watch("seoTitle") || ""}
            onChange={(e) => setValue("seoTitle", e.target.value)}
            errorMessage={errors.seoTitle?.message}
          />
        </InputWrapper>

        {/* SEO Description */}
        <InputWrapper
          label="SEO Description"
          labelFor="seoDescription"
          error={errors.seoDescription?.message}
        >
          <TextArea
            placeHolder="Enter SEO description"
            currentValue={watch("seoDescription") || ""}
            onChange={(e) => setValue("seoDescription", e.target.value)}
            errorMessage={errors.seoDescription?.message}
            row={5}
          />
        </InputWrapper>

        {/* Image Upload */}
        <div>
          <InputWrapper label={"Upload Image"}>
            <div className="border-2 border-dashed rounded-md py-3 px-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
              />
            </div>
          </InputWrapper>

          {/* Preview of Uploaded Image */}
          {preview && (
            <div className="relative w-20 h-20 border rounded-md overflow-hidden mt-2">
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
                  setUploadedImage(undefined);
                }}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Alt Text */}
        <InputWrapper
          label="Alt Text (Optional)"
          labelFor="alt"
          error={errors.alt?.message}
        >
          <Input
            placeholder="Enter alt text for image (optional)"
            value={watch("alt") || ""}
            onChange={(e) => setValue("alt", e.target.value)}
            errorMessage={errors.alt?.message}
          />
        </InputWrapper>
      </div>

      {/* Content */}
      <div className="mt-10">
        <InputWrapper
          label="Content"
          labelFor="content"
          error={errors.content?.message}
        >
          <DraftEditor
            value={watch("content")}
            onChange={(data) => {
              setValue("content", data);
              setError("content", { type: "custom", message: "" });
            }}
            height="400px"
            placeholder="Write your blog content..."
          />
        </InputWrapper>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploadLoading || postLoading}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit {(uploadLoading || postLoading) && <ButtonLoader />}
        </button>
      </div>
    </form>
  );
};

export default BlogFormModal;
