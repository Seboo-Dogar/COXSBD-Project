// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET() {
//   const currencies = await prisma.currency.findMany();
//   return NextResponse.json(currencies);
// }

// export async function POST(req: NextRequest) {
//   const { name, code, rate } = await req.json();
//   const currency = await prisma.currency.create({
//     data: { name, code, rate: parseFloat(rate) },
//   });
//   return NextResponse.json(currency);
// }

// export async function PUT(req: NextRequest) {
//   const { id, name, code, rate } = await req.json();
//   const currency = await prisma.currency.update({
//     where: { id: Number(id) },
//     data: { name, code, rate: parseFloat(rate) },
//   });
//   return NextResponse.json(currency);
// }

// export async function DELETE(req: NextRequest) {
//   const { id } = await req.json();
//   await prisma.currency.delete({ where: { id: Number(id) } });
//   return NextResponse.json({ message: "Deleted" });
// }
