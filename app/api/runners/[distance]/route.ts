import { type NextRequest, NextResponse } from "next/server"
import runners75kData from "@/data/runners-75k.json"
import runners55kData from "@/data/runners-55k.json"

export async function GET(request: NextRequest, { params }: { params: { distance: string } }) {
  const distance = params.distance

  // Validate the distance parameter
  if (distance !== "75k" && distance !== "55k") {
    return NextResponse.json({ error: "Invalid distance parameter. Use '75k' or '55k'." }, { status: 400 })
  }

  // Return the appropriate data based on the distance
  if (distance === "75k") {
    return NextResponse.json(runners75kData)
  } else {
    return NextResponse.json(runners55kData)
  }
}

