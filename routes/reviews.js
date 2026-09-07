const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');

// Add review
router.post('/add', async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;

    const review = new Review({
      product: productId,
      user: userId,
      rating,
      comment,
      verified: true
    });

    await review.save();

    // Update product rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { rating: avgRating });

    res.json({ success: true, data: review, message: 'تم إضافة التقييم بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get product reviews
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'fullName').sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete review (admin)
router.delete('/delete/:reviewId', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ success: true, message: 'تم حذف التقييم' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
