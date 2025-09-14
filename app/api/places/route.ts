import { NextResponse } from "next/server";

import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const take = searchParams.get("take");
    const country = searchParams.get("country");
    const state = searchParams.get("state");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required." },
        { status: 400 },
      );
    }

    const places = await prisma.item.findMany({
      where: {
        ...(country && { country }),
        ...(state && { state }),
        place: {
          contains: query,
          mode: "insensitive",
        },
      },
      distinct: ["country", "state", "place"],
      take: Math.min(Number(take) || 10, 100),
      select: {
        country: true,
        state: true,
        place: true,
      },
    });

    const placeNames = places.map((p) => p.place).filter(Boolean);

    return NextResponse.json(placeNames);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Places API Error:", error);

    return NextResponse.json(
      { error: "An error occurred while fetching places." },
      { status: 500 },
    );
  }
}
