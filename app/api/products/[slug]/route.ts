import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/data/content";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;
    const product = getProductBySlug(slug);

    if (!product) {
      return NextResponse.json(
        { success: false, message: `Product with slug '${slug}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Product detail API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
