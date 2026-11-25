import { NextResponse } from "next/server";
import { getCartCount } from "@/lib/cart";

export async function GET() {
  return NextResponse.json({ count: await getCartCount() });
}
