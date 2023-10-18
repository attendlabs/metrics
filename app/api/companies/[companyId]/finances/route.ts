import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { companyId: string } }
) {
    try {
        const { userId } = auth();
        const { value } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const payment = await db.payment.create({
            data: {
                value,
                companyId: params.companyId,
            }
        })

        return NextResponse.json(payment);

    } catch (error) {
        console.log("[PAYMENT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}