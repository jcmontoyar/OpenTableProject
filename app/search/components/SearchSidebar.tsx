import { PRICE, PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function SearchSideBar({
  searchParams,
}: {
  searchParams: { city?: string; cuisine?: string; price?: PRICE };
}) {
  const prices = [
    { price: PRICE.CHEAP, label: "$", className:"border w-full text-reg font-light rounded-l p-2 text-center" },
    { price: PRICE.REGULAR, label: "$$", className:"border w-full text-reg font-light  p-2 text-center" },
    { price: PRICE.EXPENSIVE, label: "$$$" , className:"border w-full text-reg font-light rounded-r p-2 text-center"},
  ];

  const fetchLocations = async () => {
    const locations = prisma.location.findMany({
      select: {
        name: true,
        id: true,
      },
    });
    return locations;
  };

  const fetchCuisines = async () => {
    const cuisines = prisma.cuisine.findMany({
      select: {
        name: true,
        id: true,
      },
    });
    return cuisines;
  };

  const locations = await fetchLocations();
  const cuisines = await fetchCuisines();

  return (
    <div className="w-1/5">
      <div className="border-b pb-4 flex flex-col">
        <h1 className="mb-2">Region</h1>
        <>
          {locations.map((location) => (
            <Link
              href={{
                pathname: "/search",
                query: {
                  ...searchParams,
                  city: location.name,
                },
              }}
              key={location.id}
              className="font-light text-reg capitalize"
            >
              {location.name}
            </Link>
          ))}
        </>
      </div>
      <div className="border-b pb-4 mt-3 flex flex-col">
        <h1 className="mb-2">Cuisine</h1>
        <>
          {cuisines.map((cuisine) => (
            <Link
              href={{
                pathname: "/search",
                query: {
                  ...searchParams,
                  cuisine: cuisine.name,
                },
              }}
              key={cuisine.id}
              className="font-light text-reg capitalize"
            >
              {cuisine.name}
            </Link>
          ))}
        </>
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          {prices.map((price) => (
            <Link
              key={price.price}
              href={{
                pathname: "/search",
                query: {
                  ...searchParams,
                  price: price.price,
                },
              }}
              className={price.className}
            >
              {price.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
