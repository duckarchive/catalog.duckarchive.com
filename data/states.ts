import prisma from "@/lib/db";

const getStates = async () => {
  const states = await prisma.item.findMany({
    where: {
      state: { not: null },
    },
    select: { state: true },
    distinct: ["state"],
    orderBy: { state: "asc" },
  });

  return states.map((i) => i.state) as string[];
};

export default getStates;
