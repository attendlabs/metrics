import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
    req: Request,
    { params }: { params: { companyId: string } }
) {
    try {
        const { userId } = auth();
        const { observation, company } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }


        const historyAdd = await db.history.create({
            data: {
                observation,
                companyId: params.companyId,
                company
            }
        });

        return NextResponse.json(historyAdd);


    } catch (error) {
        console.log("[HISTORY]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}