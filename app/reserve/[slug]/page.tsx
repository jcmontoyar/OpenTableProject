import { PrismaClient } from "@prisma/client";
import Form from "./components/Form";
import Header from "./components/Header";
import { notFound } from "next/navigation";
import { partySize } from "../../../data";

const prisma = new PrismaClient()

const fetchRestaurantSlug = async(slug:string) =>{
  const restaurant = prisma.restaurant.findUnique({
    where:{
      slug
    }
  })
  if(!restaurant){
    return notFound()
  }
  return restaurant;
}

export default async function ReserveRestaurant({params, searchParams}:{params:{slug:string}, searchParams:{date:String, partySize:String}}) {
  const res = await fetchRestaurantSlug(params.slug)
  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <Header image={res.main_image} name={res.name} date={searchParams.date} partySize={searchParams.partySize} />
        <Form  date={searchParams.date} partySize={searchParams.partySize} slug={params.slug}/>
      </div>
    </div>
  );
}
