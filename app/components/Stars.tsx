import fullStar from "../../public/full-star.png";
import halfStar from "../../public/half-star.png";
import emptyStar from "../../public/empty-star.png";
import Image from "next/image";
import { Review } from "@prisma/client";
import { calculateReviewRatingAverage } from "../utilities/calculateReviewsAverage";

export default function Stars({ reviews }: { reviews: Review[] }) {
  const rating = calculateReviewRatingAverage(reviews);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const dif = parseFloat((rating - i).toFixed(1));
      if (dif >= 1) stars.push(fullStar);
      else if (dif < 1 && dif > 0) {
        if (dif <= 0.2) stars.push(emptyStar);
        else if (dif > 0.2 && dif <= 0.6) stars.push(halfStar);
        else stars.push(fullStar);
      } else stars.push(emptyStar);
    }
    return stars.map((star, index) => (
      <Image key={index} src={star} className="w-4 h-4 mr-1" alt="" />
    ));
  };
  return <div className="flex items-center"> {renderStars()}</div>;
}
