import { NextResponse } from "next/server"
import runnersData from "@/data/runners.json"

export async function GET() {
  return NextResponse.json(runnersData)
}

