import prisma from "@/lib/db";

const getRecordTypes = async () => {
  const recordTypes = await prisma.item.findMany({
    select: { record_type: true },
    distinct: ["record_type"],
    orderBy: { record_type: "asc" },
  });

  return recordTypes.map((i) => i.record_type);
};

export default getRecordTypes;
