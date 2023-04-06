import { Inter } from "@next/font/google";
import Header from "./components/Header";
import Card from "./components/RestaurantCard";
import { PrismaClient, Cuisine, Location, PRICE, Review } from "@prisma/client";

export interface RestaurantCardType {
  id: number;
  name: string;
  main_image: string;
  cuisine: Cuisine;
  location: Location;
  price: PRICE;
  slug: string;
  reviews: Review[]
}

const inter = Inter({ subsets: ["latin"] });
const prisma = new PrismaClient();
const fetchRestaurants = async (): Promise<RestaurantCardType[]> => {
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      main_image: true,
      cuisine: true,
      location: true,
      price: true,
      slug: true,
      reviews: true
    },
  });
  return restaurants;
};

export default async function Home() {
  const restaurants = await fetchRestaurants();
  return (
    <main>
      <Header />
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        {restaurants.map((restaurant) => (
          <Card restaurant={restaurant} key={restaurant.id} />
        ))}
      </div>
    </main>
  );
}
