import Menu from "./components/Menu";
import RestaurantNavBar from "../components/RestaurantNavBar";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fetchMenuFromRestaurantSlug = async (resSlug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: resSlug,
    },
    select: {
      items: true,
    },
  });
  if (!restaurant) {
    throw new Error();
  }
  return restaurant.items;
};

export default async function RestaurantMenu({
  params,
}: {
  params: { slug: string };
}) {
  let items = await fetchMenuFromRestaurantSlug(params.slug);

  return (
    <div className="bg-white w-[100%] rounded p-3 shadow">
      <RestaurantNavBar slug={params.slug} />
      <Menu menu={items} />
    </div>
  );
}
