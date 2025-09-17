import { NextResponse } from "next/server";

import { Item, Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/db";

export type SearchRequest = Partial<Item>;

export type SearchResponse = Prisma.ItemGetPayload<{
  include: {
    archive: true;
  };
}>[];

export async function POST(request: Request) {
  try {
    const {
      title,
      place,
      author,
      author_administration,
      year,
      tags,
      fund,
      description,
      case: case_number, // 'case' is a reserved keyword
    }: SearchRequest = await request.json();

    const where: Prisma.ItemWhereInput = {};

    if (title) {
      where.title = { contains: title, mode: "insensitive" };
    }
    if (place) {
      where.place = { contains: place, mode: "insensitive" };
    }
    if (author) {
      where.author = { contains: author, mode: "insensitive" };
    }
    if (author_administration) {
      where.author_administration = author_administration;
    }
    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }
    if (year) {
      where.year = year;
    }
    if (fund) {
      where.fund = fund;
    }
    if (description) {
      where.description = description;
    }
    if (case_number) {
      where.case = case_number;
    }

    const items = await prisma.item.findMany({
      where,
      include: {
        archive: true,
      },
      take: 20,
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Search API Error:", error);

    return NextResponse.json({ error: "An error occurred while searching." }, { status: 500 });
  }
}
