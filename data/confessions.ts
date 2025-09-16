import prisma from "@/lib/db";

const getConfessions = async () => {
  const confessions = await prisma.item.findMany({
    where: {
      confession: { not: null },
    },
    select: { confession: true },
    distinct: ["confession"],
    orderBy: { confession: "asc" },
  });

  return confessions.map((i) => i.confession) as string[];
};

export default getConfessions;
