// "use client";

// import { useEffect, useRef, useState } from "react";
// import { DialogContent } from "@/components/ui/dialog";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useUpdatePostMutation } from "@/components/store/api/blogPost/blogPostApi";
// import { useToast } from "@/components/ui/use-toast";
// import ButtonLoader from "@/components/loader/ButtonLoader";
// import {
//   BlogFormData,
//   blogSchema,
// } from "@/schemas/blogPostSchema/blogPostSchema";
// import DraftEditor from "@/components/common/draftEditor/DraftEditor";
// import { XCircle } from "lucide-react";
// import InputWrapper from "@/components/common/wrapper/InputWrapper";
// import TextArea from "@/components/ui/text-area";
// import Input from "@/components/ui/input"; // Fixed the incorrect import
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useGetBlogCategoriesQuery } from "@/components/store/api/blogCategory/blogCategoryApi";
// import { useGetBlogTagsQuery } from "@/components/store/api/blogTags/blogTagsApi";
// import { capitalizeEveryWord } from "@/utils/helper/capitalizeEveryWord";
// import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";

// interface BlogPostEditModalProps {
//   initialData: BlogFormData & { id: number };
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const BlogPostEditModal = ({
//   initialData,
//   onClose,
//   onSuccess,
// }: BlogPostEditModalProps) => {
//   const { toast } = useToast();
//   const [updatePost, { isLoading }] = useUpdatePostMutation();

//   const {
//     // register,
//     handleSubmit,
//     setValue,
//     setError,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm<BlogFormData>({
//     resolver: yupResolver(blogSchema),
//     defaultValues: initialData,
//   });

//   const [searchQuery, setSearchQuery] = useState({ category: "", tag: "" });
//   const [uploadedImage, setUploadedImage] = useState<File | undefined>();
//   const [altText, setAltText] = useState("");
//   const [preview, setPreview] = useState<string | null>(
//     initialData.image || null
//   );
//   const [addThumbnail, { isLoading: uploadLoading }] =
//     useAddThumbnailMutation();
//   const [content, setContent] = useState<string>(initialData.content || "");

//   const searchInputRef = useRef<HTMLInputElement | null>(null);

//   const { data: categoryList, isLoading: categoryLoading } =
//     useGetBlogCategoriesQuery({});
//   const { data: tagList, isLoading: tagLoading } = useGetBlogTagsQuery({});

//   useEffect(() => {
//     reset(initialData);
//     setContent(initialData.content || "");
//     setPreview(initialData.image || null);
//   }, [initialData, reset]);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setUploadedImage(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSearchChange = (type: "category" | "tag", value: string) => {
//     setSearchQuery((prev) => ({ ...prev, [type]: value }));
//   };

//   const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Escape") {
//       setSearchQuery({ category: "", tag: "" });
//     }
//   };

//   const onSubmit = async (data: BlogFormData) => {
//     try {
//       let imageUrl = data.image;

//       if (uploadedImage instanceof File) {
//         const formData = new FormData();
//         formData.append("image", uploadedImage);

//         if (altText) {
//           formData.append("alt", altText);
//         }

//         const response = await addThumbnail(formData).unwrap();
//         imageUrl = response?.data?.[0] || "";
//       }

//       const updatedPost = {
//         ...data,
//         content,
//         image: imageUrl,
//       };

//       await updatePost({ id: initialData.id, ...updatedPost }).unwrap();
//       toast({
//         title: "Updated",
//         description: "Blog post updated successfully.",
//       });

//       onSuccess();
//       onClose();
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Error",
//         description: "Failed to update blog post",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//       <h2 className="text-xl font-bold mb-4">Edit Blog Post</h2>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {/* Status */}
//           <InputWrapper
//             label="Status"
//             labelFor="status"
//             error={errors.status?.message}
//           >
//             <Select
//               value={watch("status")}
//               onValueChange={(val: "Draft" | "Published" | "Trust") => {
//                 setValue("status", val);
//                 setError("status", { type: "custom", message: "" });
//               }}
//             >
//               <SelectTrigger id="status">
//                 <SelectValue placeholder="Select status..." />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Draft">Draft</SelectItem>
//                 <SelectItem value="Published">Published</SelectItem>
//                 <SelectItem value="Trust">Trust</SelectItem>
//               </SelectContent>
//             </Select>
//           </InputWrapper>

//           {/* Title */}
//           <InputWrapper
//             label="Title"
//             labelFor="title"
//             error={errors.title?.message}
//           >
//             <Input
//               placeholder="Enter blog title"
//               value={watch("title")}
//               onChange={(e) => setValue("title", e.target.value)}
//             />
//           </InputWrapper>

//           {/* Author */}
//           <InputWrapper
//             label="Author"
//             labelFor="author"
//             error={errors.author?.message}
//           >
//             <Input
//               placeholder="Enter author name"
//               value={watch("author")}
//               onChange={(e) => setValue("author", e.target.value)}
//             />
//           </InputWrapper>

//           {/* Category */}
//           <InputWrapper
//             label="Category"
//             labelFor="category"
//             error={errors.categoryId?.message}
//           >
//             <Select
//               value={watch("categoryId")?.toString()}
//               onValueChange={(value: string) => {
//                 setValue("categoryId", +value);
//                 setError("categoryId", { type: "custom", message: "" });
//               }}
//             >
//               <SelectTrigger id="category">
//                 <SelectValue placeholder="Select category..." />
//               </SelectTrigger>
//               <SelectContent className="max-h-[200px] overflow-y-auto">
//                 <div className="p-2">
//                   <input
//                     type="text"
//                     placeholder="Search category..."
//                     value={searchQuery.category}
//                     onChange={(e) =>
//                       handleSearchChange("category", e.target.value)
//                     }
//                     onKeyDown={handleInputKeyDown}
//                     ref={searchInputRef}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                     autoFocus
//                   />
//                 </div>
//                 {categoryList?.data
//                   ?.filter((cat: any) =>
//                     cat.name
//                       .toLowerCase()
//                       .includes(searchQuery.category.toLowerCase())
//                   )
//                   .map((cat: any) => (
//                     <SelectItem key={cat.id} value={cat.id.toString()}>
//                       {capitalizeEveryWord(cat.name)}
//                     </SelectItem>
//                   ))}
//                 {!categoryList?.data?.length && categoryLoading && (
//                   <div className="flex justify-center items-center h-8">
//                     <ButtonLoader />
//                   </div>
//                 )}
//               </SelectContent>
//             </Select>
//           </InputWrapper>

//           {/* Tag */}
//           <InputWrapper
//             label="Tag"
//             labelFor="tag"
//             error={errors.tagId?.message}
//           >
//             <Select
//               value={watch("tagId")?.toString()}
//               onValueChange={(value: string) => {
//                 setValue("tagId", +value);
//                 setError("tagId", { type: "custom", message: "" });
//               }}
//             >
//               <SelectTrigger id="tag">
//                 <SelectValue placeholder="Select tag..." />
//               </SelectTrigger>
//               <SelectContent className="max-h-[200px] overflow-y-auto">
//                 <div className="p-2">
//                   <input
//                     type="text"
//                     placeholder="Search tag..."
//                     value={searchQuery.tag}
//                     onChange={(e) => handleSearchChange("tag", e.target.value)}
//                     onKeyDown={handleInputKeyDown}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                   />
//                 </div>
//                 {tagList?.data
//                   ?.filter((tag: any) =>
//                     tag.name
//                       .toLowerCase()
//                       .includes(searchQuery.tag.toLowerCase())
//                   )
//                   .map((tag: any) => (
//                     <SelectItem key={tag.id} value={tag.id.toString()}>
//                       {capitalizeEveryWord(tag.name)}
//                     </SelectItem>
//                   ))}
//                 {!tagList?.data?.length && tagLoading && (
//                   <div className="flex justify-center items-center h-8">
//                     <ButtonLoader />
//                   </div>
//                 )}
//               </SelectContent>
//             </Select>
//           </InputWrapper>

//           {/* SEO Title */}
//           <InputWrapper
//             label="SEO Title"
//             labelFor="seoTitle"
//             error={errors.seoTitle?.message}
//           >
//             <Input
//               placeholder="Enter SEO title"
//               value={watch("seoTitle") || ""}
//               onChange={(e) => setValue("seoTitle", e.target.value)}
//             />
//           </InputWrapper>

//           {/* SEO Description */}
//           <InputWrapper
//             label="SEO Description"
//             labelFor="seoDescription"
//             error={errors.seoDescription?.message}
//           >
//             <TextArea
//               placeHolder="Enter SEO description"
//               currentValue={watch("seoDescription") || ""}
//               onChange={(e) => setValue("seoDescription", e.target.value)}
//               errorMessage={errors.seoDescription?.message}
//               row={5}
//             />
//           </InputWrapper>

//           {/* Upload Image */}
//           <div className="">
//             <InputWrapper label={"Upload Image"}>
//               <div className="border-2 border-dashed rounded-md py-3 px-3">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="block w-full text-sm text-gray-500
//                              file:mr-4 file:py-2 file:px-4
//                              file:rounded-md file:border-0
//                              file:text-sm file:font-semibold
//                              file:bg-blue-50 file:text-blue-700
//                              hover:file:bg-blue-100"
//                 />
//               </div>

//               {preview && (
//                 <div className="relative w-20 h-20 border rounded-md overflow-hidden mt-2">
//                   <img
//                     src={preview}
//                     alt="Preview"
//                     className="w-full h-full object-cover"
//                   />
//                   <button
//                     type="button"
//                     className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//                     onClick={() => {
//                       setPreview(null);
//                       setUploadedImage(undefined);
//                     }}
//                   >
//                     <XCircle className="w-5 h-5" />
//                   </button>
//                 </div>
//               )}
//             </InputWrapper>
//           </div>

//           {/* Alt */}
//           <div className="p-2">
//             <label htmlFor="">{"Alt text"}</label>
//             <Input
//               placeholder={"Enter alt text"}
//               value={altText}
//               onChange={(e) => setAltText(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Content */}
//         <div className="mt-10">
//           <DraftEditor
//             value={content}
//             onChange={(data) => setContent(data)}
//             height="400px"
//             placeholder="Write your blog content..."
//           />
//         </div>

//         <div className="flex justify-end">
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={uploadLoading || isLoading}
//           >
//             {isLoading || uploadLoading ? <ButtonLoader /> : "Update"}
//           </button>
//         </div>
//       </form>
//     </DialogContent>
//   );
// };

// export default BlogPostEditModal;
