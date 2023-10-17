import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
    req: Request,
    { params }: { params: { companyId: string } }
) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }


        const history = await db.history.create({
            data: {
                title,
                companyId: params.companyId,
            }
        });

        return NextResponse.json(history);


    } catch (error) {
        console.log("[HISTORY]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}