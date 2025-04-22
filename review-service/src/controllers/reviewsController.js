import Review from "../schema/Reviews.js";
export const reviewsController = {
  addReview: async (req, res) => {
    try {
      const review = new Review(req.body);
      const savedReview = await review.save();
      res.status(201).json(savedReview);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  updateReview: async (req, res) => {
    try {
      const updatedReview = await Review.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedReview)
        return res.status(404).json({ error: "Review not found" });
      res.json(updatedReview);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  getReviewById: async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) return res.status(404).json({ error: "Review not found" });
      res.json(review);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  getReviewsByRestaurant: async (req, res) => {
    try {
      const reviews = await Review.find({
        restaurant: req.params.restaurantId,
      });
      res.json(reviews);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  getReviewsByFood: async (req, res) => {
    try {
      const reviews = await Review.find({ food: req.params.foodId });
      res.json(reviews);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  deleteReview: async (req, res) => {
    try {
      const deletedReview = await Review.findByIdAndDelete(req.params.id);
      if (!deletedReview)
        return res.status(404).json({ error: "Review not found" });
      res.json({ message: "Review deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
