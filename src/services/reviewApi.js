let mockReviews = [
  {
    productId: "prod-101",
    variantId: "var-201",
    merchantId: "merch-301",
    rating: 4,
    title: "Value-for-money",
    description: "Good sound quality and long battery life.",
  },
];

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const reviewApi = {
  async getReview(productId, variantId, merchantId) {
    await delay();
    const review = mockReviews.find(
      (r) =>
        r.productId === productId &&
        r.variantId === variantId &&
        r.merchantId === merchantId,
    );
    return review ? { ...review } : null;
  },

  async submitReview(reviewData) {
    await delay();
    // u_id should be extracted from the JWT, since the review is protected.
    const index = mockReviews.findIndex(
      (r) =>
        r.productId === reviewData.productId &&
        r.variantId === reviewData.variantId &&
        r.merchantId === reviewData.merchantId,
    );

    if (index !== -1) {
      mockReviews[index] = { ...reviewData };
    } else {
      mockReviews.push({ ...reviewData });
    }
    return { ...reviewData };
  },

  async getProductDetails(productId, variantId, merchantId) {
    await delay();
    return {
      productId,
      variantId,
      merchantId,
      name: "ARISTOCRAT Carnival 55cm Cabin Luggage",
      thumbnail: "https://via.placeholder.com/48/2563eb/ffffff?text=Product",
    };
  },
};
