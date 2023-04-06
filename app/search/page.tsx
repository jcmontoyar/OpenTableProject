import Header from "./components/Header";
import SearchSideBar from "./components/SearchSidebar";
import RestaurantCard from "./components/RestaurantCard";
import { PRICE, PrismaClient } from "@prisma/client";

const client = new PrismaClient()

const select = {
  name:true,
  id:true,
  slug:true,
  price: true,
  cuisine: true,
  main_image: true,
  location : true,
  reviews: true
}

export default async function Search({searchParams}:{searchParams:{city?:string, cuisine?:string, price?:PRICE}}) {

  const fetchRestaurantByLocationCityAndPrice = async() =>{
    //get param from url

    if(!searchParams.city) return await client.restaurant.findMany({select});
    const where: any = {}
    if(searchParams.city){
      const location ={
        name:{
          contains: searchParams.city,
          mode: "insensitive"
        }
      }
      where.location = location
    }
    if(searchParams.cuisine){
      const cuisine = {
        name:{
          contains: searchParams.cuisine,
          mode: "insensitive"
        }
      }
      where.cuisine = cuisine
    }
    if(searchParams.price){
      where.price = searchParams.price
    }

    return await client.restaurant.findMany({
      where,
      select
    })
  }

  const restaurants = await fetchRestaurantByLocationCityAndPrice()
  
  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar searchParams={searchParams}/>
        <div className="w-5/6">
          {restaurants.length ? restaurants.map(restaurant =>(<RestaurantCard key={restaurant.id} restaurant={restaurant}/>) ): <p>Sorry, there are no restaurants that match your query</p>}
        </div>
      </div>
    </>
  );
}
