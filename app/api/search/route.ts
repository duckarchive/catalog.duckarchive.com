import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      country,
      state,
      place,
      church_name,
      church_administration,
      confession,
      year,
      record_type,
      fund,
      description,
      case: case_number, // 'case' is a reserved keyword
    } = body;

    const where: Prisma.ItemWhereInput = {};

    if (country) {
      where.country = country;
    }
    if (state) {
      where.state = state;
    }
    if (place) {
      where.place = { contains: place, mode: "insensitive" };
    }
    if (church_name) {
      where.church_name = { contains: church_name, mode: "insensitive" };
    }
    if (church_administration) {
      where.church_administration = church_administration;
    }
    if (confession) {
      where.confession = confession;
    }
    if (year) {
      where.year = year;
    }
    if (record_type) {
      where.record_type = record_type;
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
    });

    return NextResponse.json(items);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Search API Error:", error);

    return NextResponse.json(
      { error: "An error occurred while searching." },
      { status: 500 }
    );
  }
}
