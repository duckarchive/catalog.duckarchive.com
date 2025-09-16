import prisma from "@/lib/db";

const getChurchAdministrations = async () => {
  const churchAdministrations = await prisma.item.findMany({
    where: {
      church_administration: { not: null },
    },
    select: { church_administration: true },
    distinct: ["church_administration"],
    orderBy: { church_administration: "asc" },
  });

  return churchAdministrations.map((i) => i.church_administration) as string[];
};

export default getChurchAdministrations;
