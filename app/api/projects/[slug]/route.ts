import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "@/data/content";

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
    const project = getProjectBySlug(slug);

    if (!project) {
      return NextResponse.json(
        { success: false, message: `Project with slug '${slug}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Project detail API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
