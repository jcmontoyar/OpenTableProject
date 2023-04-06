import { Review } from "@prisma/client";

export const calculateReviewRatingAverage = (reviews: Review[]) => {
  if (reviews.length) {
    return (
      reviews.reduce((total, next) => total + next.rating, 0) / reviews.length
    );
  }
  return 0;
};
