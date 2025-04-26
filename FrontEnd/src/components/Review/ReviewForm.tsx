import React, { useState } from "react";
import api5006 from "../../api/api5006";
import { useEffect } from "react";

interface ReviewFormProps {
    restaurantId: string;
    foodId: string;
    userId?: string;
    onClose: () => void;
    onReviewSubmit: () => Promise<void>;

}

const ReviewForm: React.FC<ReviewFormProps> = ({ restaurantId, foodId, userId, onClose, onReviewSubmit }) => {
    useEffect(() => {
        console.log("ReviewForm Props:");
        console.log("restaurantId:", restaurantId);
        console.log("foodId:", foodId);
        console.log("userId:", userId);
    }, [restaurantId, foodId, userId]);

    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);

    const handleStarClick = (selectedRating: number) => {
        setRating(selectedRating);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitSuccess(null);

        try {
            const reviewData = {
                user: userId,
                restaurant: restaurantId,
                food: foodId,
                rating,
                comment,
            };

            const response = await api5006.post("/", reviewData);
            console.log("Review submitted:", response.data);
            setSubmitSuccess(true);
            setRating(0);
            setComment("");
            await onReviewSubmit();
            onClose();

        } catch (err: any) {
            console.error("Error submitting review:", err);
            setSubmitSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
            >
                <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-6 flex items-center">
                    Rate Your Experience
                </h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Rating
                    </label>
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => handleStarClick(star)}
                                className="focus:outline-none p-1"
                            >
                                <svg
                                    className={`w-8 h-8 ${star <= rating
                                        ? "text-yellow-400"
                                        : "text-gray-300 dark:text-gray-600"
                                        }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            {rating > 0 ? (
                                <>
                                    <span className="font-medium text-gray-700 dark:text-gray-200">
                                        {rating}
                                    </span>{" "}
                                    out of 5
                                </>
                            ) : (
                                "Select rating"
                            )}
                        </span>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Review
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this item..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition duration-150"
                        rows={4}
                    />
                </div>

                <div className="flex items-center justify-center ">
                    <button
                        type="submit"
                        disabled={rating === 0 || isSubmitting}
                        className={`px-5 py-2.5 rounded-lg font-medium w-full text-white transition-all duration-200 flex items-center ${rating === 0 || isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-orange-400 hover:bg-orange-500 shadow-sm hover:shadow"
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Submit Review
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;