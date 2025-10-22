// app/api/submit/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    return NextResponse.json({ success: true, received: body });
}
