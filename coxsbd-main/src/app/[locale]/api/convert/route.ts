// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function POST(req: NextRequest) {
//   const { fromCode, toCode, amount } = await req.json();

//   const from = await prisma.currency.findUnique({ where: { code: fromCode } });
//   const to = await prisma.currency.findUnique({ where: { code: toCode } });

//   if (!from || !to) return NextResponse.json({ error: "Currency not found" });

//   const converted = (parseFloat(amount) / from.rate) * to.rate;

//   return NextResponse.json({ result: converted });
// }
