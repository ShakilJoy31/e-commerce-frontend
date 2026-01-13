import { useState } from "react";
import { useParams } from "react-router-dom";
import {
    useGetReviewByProductQuery,
    useReplyToReviewMutation,
    useUpdateReviewReplyMutation,
    useDeleteReviewReplyMutation
} from "@/components/store/api/review/reviewApi";
import { FiMessageSquare, FiTrash2 } from "react-icons/fi";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const ProductReviews = () => {
    const { id } = useParams<{ id: string }>();
    const { data: response, isLoading, isError } = useGetReviewByProductQuery(id!);
    const [replyToReview] = useReplyToReviewMutation();
    const [updateReviewReply] = useUpdateReviewReplyMutation();
    const [deleteReviewReply] = useDeleteReviewReplyMutation();
    const { toast } = useToast();

    // State for reply dialog
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentReplyId, setCurrentReplyId] = useState<number | null>(null);

    // State for delete confirmation
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [replyToDelete, setReplyToDelete] = useState<number | null>(null);

    const reviews = response?.data || [];
    const product = reviews[0]?.product;

    const handleReplySubmit = async () => {
        if (!replyingTo || !replyText.trim()) return;

        setIsSubmitting(true);
        try {
            if (currentReplyId) {
                // Update existing reply
                await updateReviewReply({
                    id: currentReplyId,
                    comment: replyText
                }).unwrap();
                toast({
                    title: "Reply Updated",
                    description: "Your response has been successfully updated.",
                });
            } else {
                // Create new reply
                await replyToReview({
                    id: replyingTo,
                    comment: replyText
                }).unwrap();
                toast({
                    title: "Reply Submitted",
                    description: "Your response has been successfully posted.",
                });
            }

            // Close dialog and reset state
            setIsDialogOpen(false);
            setReplyingTo(null);
            setCurrentReplyId(null);
            setReplyText("");
        } catch (error) {
            console.error("Failed to submit reply:", error);
            toast({
                title: "Error",
                description: "Failed to submit reply. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteReply = async () => {
        if (!replyToDelete) return;

        try {
            await deleteReviewReply(replyToDelete).unwrap();
            toast({
                title: "Reply Deleted",
                description: "Your response has been successfully deleted.",
            });
        } catch (error) {
            console.error("Failed to delete reply:", error);
            toast({
                title: "Error",
                description: "Failed to delete reply. Please try again.",
                variant: "destructive",
            });
        } finally {
            setDeleteDialogOpen(false);
            setReplyToDelete(null);
        }
    };

    const openDeleteConfirmation = (replyId: number) => {
        setReplyToDelete(replyId);
        setDeleteDialogOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mt-20 text-center text-red-500">
                Error loading reviews. Please try again later.
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Product Header */}
            {reviews.length > 0 && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="md:flex">
                        <div className="md:w-1/3">
                            <img
                                className="h-full w-full object-cover"
                                src={product?.ProductImage?.[0]?.imageUrl || "/placeholder-product.jpg"}
                                alt={product?.productName}
                            />
                        </div>
                        <div className="p-8 md:w-2/3">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {product?.productName}
                            </h1>
                            <p className="text-gray-600 mb-4">
                                Manage and respond to customer reviews for this product
                            </p>
                            <div className="flex items-center">
                                <div className="flex items-center mr-4">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-xl ${i < (product?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="text-gray-500">
                                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Customer Reviews</h2>
                </div>

                {reviews.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {reviews.map((review) => (
                            <div key={review.id} className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={review.user?.avatar || "/placeholder-avatar.jpg"}
                                            alt={review.user?.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {review.user?.name || 'Anonymous'}
                                            </h3>
                                            <div className="flex items-center mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>

                                <p className="mt-3 text-gray-700 pl-14">{review.review}</p>

                                {/* Admin Reply Section */}
                                {review.ReplayReview && (
                                    <div className="mt-4 pl-14">
                                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center space-x-2">
                                                    <img
                                                        src={review.ReplayReview.user?.avatar || "/placeholder-avatar.jpg"}
                                                        alt={review.ReplayReview.user?.name}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                    <h4 className="font-medium text-blue-800">Admin Reply</h4>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(review.ReplayReview.updatedAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                    <button
                                                        onClick={() => openDeleteConfirmation(review.ReplayReview.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="mt-2 ml-10 text-blue-700">{review.ReplayReview.comment}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Reply Button with Dialog */}
                                <div className="mt-4 pl-14">
                                    <Dialog open={isDialogOpen && replyingTo === review.id} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                            <button
                                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                onClick={() => {
                                                    setReplyingTo(review.id);
                                                    setCurrentReplyId(review.ReplayReview?.id || null);
                                                    setReplyText(review.ReplayReview?.comment || "");
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                <FiMessageSquare className="mr-1.5" />
                                                {review.ReplayReview ? "Edit Reply" : "Reply to Review"}
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="p-6 rounded-lg shadow-lg sm:max-w-[600px]">
                                            <h3 className="text-xl font-semibold mb-4">
                                                {review.ReplayReview ? "Edit Reply" : "Reply to Review"}
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Your Reply
                                                    </label>
                                                    <textarea
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        rows={4}
                                                        placeholder="Write your response to this review..."
                                                    />
                                                </div>
                                                <div className="flex justify-end space-x-3">
                                                    <button
                                                        onClick={() => setIsDialogOpen(false)}
                                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleReplySubmit}
                                                        disabled={isSubmitting || !replyText.trim()}
                                                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(isSubmitting || !replyText.trim()) ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                    >
                                                        {isSubmitting ? (
                                                            <span className="flex items-center">
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Submitting...
                                                            </span>
                                                        ) : (
                                                            review.ReplayReview ? "Update Reply" : "Submit Reply"
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">No reviews yet for this product.</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="p-6 rounded-lg shadow-lg sm:max-w-[425px]">
                    <h3 className="text-xl font-semibold mb-4">Delete Reply</h3>
                    <p className="mb-6">Are you sure you want to delete this reply? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setDeleteDialogOpen(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteReply}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Delete
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductReviews;