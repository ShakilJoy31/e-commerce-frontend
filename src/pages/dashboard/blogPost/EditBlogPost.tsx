import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@/components/ui/use-toast";
import ButtonLoader from "@/components/loader/ButtonLoader";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  BlogFormData,
  blogSchema,
} from "@/schemas/blogPostSchema/blogPostSchema";
import DraftEditor from "@/components/common/draftEditor/DraftEditor";
import { XCircle } from "lucide-react";
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
import { useGetBlogCategoriesQuery } from "@/components/store/api/blogCategory/blogCategoryApi";
import { useGetBlogTagsQuery } from "@/components/store/api/blogTags/blogTagsApi";
// import { capitalizeEveryWord } from "@/utils/helper/capitalizeEveryWord";
import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";
import {
  useGetPostByIdQuery,
  useUpdatePostMutation,
} from "@/components/store/api/blogPost/blogPostApi";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import SearchableSelect from "../products/SearchableSelect";

const EditBlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    data: postData,
    isLoading: isPostLoading,
    isError,
    error: postError,
  } = useGetPostByIdQuery(id as string);
  console.log(postData);
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();

  // Form setup
  const {
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: yupResolver(blogSchema),
  });

  const [uploadedImage, setUploadedImage] = useState<File | undefined>();
  const [altText, setAltText] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [addThumbnail, { isLoading: isUploading }] = useAddThumbnailMutation();
  const [content, setContent] = useState<string>("");

//   const searchInputRef = useRef<HTMLInputElement | null>(null);

  const { data: categoryList, isLoading: isCategoryLoading } =
    useGetBlogCategoriesQuery({});
  const {  isLoading: isTagLoading } = useGetBlogTagsQuery({});

  // Initialize form with fetched data
  useEffect(() => {
    if (postData?.data) {
      reset({
        ...postData.data,
        categoryId: postData.data.categoryId,
        tagId: postData.data.tagId,
      });
      setContent(postData.data.content || "");
      setPreview(postData.data.image || null);
      setAltText(postData.data.imageAlt || "");
    }
  }, [postData, reset]);

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        //@ts-ignore
        description: postError || "Failed to load blog post",
        variant: "destructive",
      });
        // navigate("/kry-admin-portal/post", { replace: true });
    }
  }, [isError, postError, toast, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };



  const onSubmit = async (data: BlogFormData) => {
    try {
      let imageUrl = data.image;

      if (uploadedImage instanceof File) {
        const formData = new FormData();
        formData.append("image", uploadedImage);

        if (altText) {
          formData.append("alt", altText);
        }

        const response = await addThumbnail(formData).unwrap();
        imageUrl = response?.data?.[0] || "";
      }

      const updatedPost = {
        ...data,
        content,
        image: imageUrl,
        imageAlt: altText,
      };

      await updatePost({ id: id as string, ...updatedPost }).unwrap();
      toast({
        title: "Updated",
        description: "Blog post updated successfully.",
      });

        navigate("/kry-admin-portal/post");
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
    }
  };

  if (isPostLoading) {
    return (
      <PageWrapper>
        <LoaderSpinner />
      </PageWrapper>
    );
  }

  if (!postData?.data) {
    return null;
  }

  return (
    <PageWrapper>
      <div className="bg-white p-6 rounded-lg shadow max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Edit Blog Post</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Status */}
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
                value={watch("title") || ""}
                onChange={(e) => setValue("title", e.target.value)}
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
                value={watch("author") || ""}
                onChange={(e) => setValue("author", e.target.value)}
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
                loading={isCategoryLoading}
                labelKey="name"
              />
            </InputWrapper>

            {/* Tag */}
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
              loading={isTagLoading}
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

            {/* Upload Image */}
            <div className="col-span-full">
              <InputWrapper label="Featured Image">
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

                {preview && (
                  <div className="mt-4 flex items-center gap-4">
                    <div className="relative w-32 h-32 border rounded-md overflow-hidden">
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
                    <div className="flex-1">
                      <Input
                        placeholder="Enter alt text for image"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </InputWrapper>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Content</h2>
            <DraftEditor
              value={content}
              onChange={(data) => setContent(data)}
              height="500px"
              placeholder="Write your blog content..."
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/kry-admin-portal/post")}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUpdating || isUploading}
            >
              {isUpdating || isUploading ? <ButtonLoader /> : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default EditBlogPost;
