import prisma from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

export type Archives = Prisma.ArchiveGetPayload<{
  select: {
    id: true;
    code: true;
    title: true;
  };
}>[];;

export const getArchives = async () => {
  const archivesDb = await prisma.archive.findMany({
    select: {
      id: true,
      code: true,
      title: true,
    },
    orderBy: {
      code: "asc",
    },
  });

  return archivesDb;
};