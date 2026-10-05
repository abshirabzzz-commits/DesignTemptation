import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/data/content";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    let result = [...PRODUCTS];

    if (category && category !== "All") {
      result = result.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (featured !== null && featured !== undefined && featured !== "") {
      const isFeatured = featured.toLowerCase() === "true" || featured === "1";
      result = result.filter((p) => Boolean(p.featured) === isFeatured);
    }

    return NextResponse.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve products." },
      { status: 500 }
    );
  }
}
