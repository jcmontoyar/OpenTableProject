import { Cuisine, Location, PRICE, Review } from "@prisma/client";
import Link from "next/link";
import Price from "../../components/Price";
import { calculateReviewRatingAverage } from "../../utilities/calculateReviewsAverage";
import Stars from "../../components/Stars";

interface Restaurant{
  id: number;
  name: string;
  main_image: string;
  cuisine: Cuisine;
  location: Location;
  price: PRICE;
  slug: string;
  reviews: Review[]
}

export default function RestaurantCard({restaurant}:{restaurant:Restaurant}) {


  const renderRatingText = () =>{
   
    const averageRating = calculateReviewRatingAverage(restaurant.reviews)
    let textRating = "Bad"
    if(averageRating >= 4){
      textRating = "Awesome"
    }
    else if(averageRating > 3){
      textRating = "Good"
    }
    return textRating
  }

  return (
    <div className="border-b flex pb-5 ml-4">
      <img
        src={restaurant.main_image}
        alt=""
        className="w-44 rounded h-36"
      />
      <div className="pl-5">
        <h2 className="text-3xl">{restaurant.name}</h2>
        <div className="flex items-start">
          <Stars reviews={restaurant.reviews}/>
          <p className="ml-2 text-sm">{renderRatingText()}</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg">
            <Price price={restaurant.price}></Price>
            <p className="mr-4 capitalize">{restaurant.cuisine.name}</p>
            <p className="mr-4 capitalize">{restaurant.location.name}</p>
          </div>
        </div>
        <div className="text-red-600">
          <Link href={`/restaurant/${restaurant.slug}`}>View more information</Link>
        </div>
      </div>
    </div>
  );
}
