import { NextResponse } from "next/server";

import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const take = searchParams.get("take");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required." },
        { status: 400 },
      );
    }

    const places = await prisma.item.findMany({
      where: {
        place: {
          contains: query,
          mode: "insensitive",
        },
      },
      distinct: ["place"],
      take: Math.min(Number(take) || 10, 100),
      select: {
        place: true,
      },
    });

    const placeNames = places.map((p) => p.place).filter(Boolean);

    return NextResponse.json(placeNames);
  } catch (error) {
    console.error("Places API Error:", error);

    return NextResponse.json(
      { error: "An error occurred while fetching places." },
      { status: 500 },
    );
  }
}
