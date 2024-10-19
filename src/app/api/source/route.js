// app/api/route.js 👈🏽

import { NextResponse } from "next/server";

import { promises as fs } from "fs";

export async function GET() {
  const file = await fs.readFile(
    process.cwd() + "/src/app/api/source.js",
    "utf8"
  );

  return NextResponse.json(file, { status: 200 });
}
