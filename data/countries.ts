import prisma from "@/lib/db";

const getCountries = async () => {
  const countries = await prisma.item.findMany({
    where: {
      country: { not: null },
    },
    select: { country: true },
    distinct: ["country"],
    orderBy: { country: "asc" },
  });

  return countries.map((i) => i.country);
};

export default getCountries;