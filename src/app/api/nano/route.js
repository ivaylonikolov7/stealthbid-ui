// app/api/route.js 👈🏽

import { NextResponse } from "next/server";

export async function POST(request) {
  const { salary, timestamp } = await request.json();
  const salaryString = salary.toString();

  const response = await fetch(
    "https://nanoshutter.staging.shutter.network/encrypt/with_time",
    {
      method: "POST",
      body: JSON.stringify({
        cypher_text: salaryString,
        timestamp: Number(timestamp),
      }),
    }
  );

  const { message } = await response.json();

  return NextResponse.json(
    JSON.stringify({
      body: message,
    }),
    { status: 200 }
  );
}
