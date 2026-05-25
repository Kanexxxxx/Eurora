import { NextResponse } from "next/server";

// Product catalog is managed entirely via src/data/presentes.ts.
// DB links (PresenteLink) are no longer merged into the public view.
export async function GET() {
  return NextResponse.json({ links: [], hiddenIds: [] });
}
