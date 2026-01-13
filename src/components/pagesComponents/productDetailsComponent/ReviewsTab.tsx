import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { IoStarSharp } from "react-icons/io5";
import { useForm, Controller } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import {
  useAddReviewMutation,
  useDeleteReviewMutation,
  useGetReviewByProductQuery,
  useUpdateReviewMutation,
} from "@/components/store/api/review/reviewApi";
import { selectUser } from "@/components/store/store";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ReviewFormData,
  reviewSchema,
} from "@/schemas/review/addEditReviewSchema";
import { CgProfile } from "react-icons/cg";

export default function ReviewsTab({ description }: any) {
  const user = useSelector(selectUser);
  const productId = description?.id;


  // Fetch reviews for this product
  const { data: reviewsData, refetch } = useGetReviewByProductQuery(productId);
  const reviews = useMemo(() => reviewsData?.data || [], [reviewsData]);
 

  // Calculate Average Rating
  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  // Form Setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      userId: user?.id || 0,
      productId: productId || 0,
      rating: 5,
      review: "",
    },
  });

  // API Hooks
  const [addReview, { isLoading: adding }] = useAddReviewMutation();
  const [updateReview, { isLoading: updating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: deleting }] = useDeleteReviewMutation();

  // Local state for editing reviews
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

  // Handle Review Submission
  const onSubmit = async (data: ReviewFormData) => {
    try {
      if (!user?.id || !user?.email) {
        toast({
          title: "Error",
          description: "You must be logged in to submit a review.",
        });
        return;
      }

      if (editingReviewId) {
        await updateReview({ id: editingReviewId, data }).unwrap();
        toast({
          title: "Success",
          description: "Review updated successfully!",
        });
      } else {
        await addReview(data).unwrap();
        toast({
          title: "Success",
          description: "Review submitted successfully!",
        });
      }

      reset();
      setEditingReviewId(null);
      refetch();
    } catch (err) {
  console.error("Error:", err);
  const error = err as { data?: { message?: string } };
  toast({ 
    title: "Error", 
    description: error.data?.message || "An unknown error occurred" 
  });
}
  };

  // Handle Delete Review
  const handleDelete = async (reviewId: number) => {
    try {
      await deleteReview(reviewId).unwrap();
      toast({ title: "Deleted", description: "Review deleted successfully!" });
      refetch();
    } catch (err) {
      console.error("Error:", err);
      toast({ title: "Error", description: "Failed to delete review." });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      {/* Review Form (Only if user is logged in) */}
      {user?.id && user?.email ? (
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingReviewId
              ? "Edit Your Review"
              : `Be the first to review ${description?.productName}`}
          </h3>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Your Rating *
              </label>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <IoStarSharp
                        key={star}
                        size={24}
                        className={`cursor-pointer ${
                          star <= field.value
                            ? "text-yellow-500"
                            : "text-gray-300"
                        } transition-transform transform hover:scale-110`}
                        onClick={() => field.onChange(star)}
                      />
                    ))}
                  </div>
                )}
              />
              {errors.rating && (
                <p className="text-red-500 text-sm">{errors.rating.message}</p>
              )}
            </div>

            {/* Review Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Your Review *
              </label>
              <textarea
                {...register("review")}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary transition"
                placeholder="Write your review here..."
              ></textarea>
              {errors.review && (
                <p className="text-red-500 text-sm">{errors.review.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 bg-primary text-white font-medium rounded-lg py-3 transition hover:bg-primary-dark flex items-center justify-center gap-2"
            >
              {adding || updating
                ? "Submitting..."
                : editingReviewId
                ? "Update Review"
                : "Submit Review"}
            </button>
          </form>
        </div>
      ) : (
        <p className="text-center text-gray-600">
          You must be logged in to submit a review.
        </p>
      )}

      {/* Review Summary & List */}
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Reviews Summary</h3>
        <p className="text-lg font-bold text-yellow-500">
          ⭐ {averageRating} / 5
        </p>

        {/* Review List */}
        <ul className="mt-4 space-y-4">
          {description?.Review?.length > 0 ? (
            description?.Review?.map((review) => (
              <li key={review.id} className="border p-3 rounded-md">
                <div className="flex items-center gap-3">
                  {review?.user?.avatar ? (
                    <img
                      src={review?.user?.avatar}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <CgProfile size={30} />
                  )}
                  <div>
                    <p className="font-semibold">
                      {review?.user?.name || "Anonymous"}
                    </p>
                    <span className="flex items-center gap-1 text-yellow-500">
                      {Array(review.rating)
                        .fill(0)
                        .map((_, i) => (
                          <IoStarSharp key={i} />
                        ))}
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-gray-700">{review.review}</p>

                {review.userId === user?.id && (
                  <div className="flex gap-2 mt-2">
                    {/* Edit Button */}
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        setEditingReviewId(review.id);
                        setValue("rating", review.rating);
                        setValue("review", review.review);
                      }}
                    >
                      Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(review.id)}
                      disabled={deleting}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">No reviews yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
