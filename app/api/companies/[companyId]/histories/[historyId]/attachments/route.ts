import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { companyId: string, historyId: string } }

) {
    try {
        const { userId } = auth();
        const { url } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const companyOwner = await db.company.findUnique({
            where: {
                id: params.companyId,
            }
        });

        if (!companyOwner) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const attachment = await db.historyAttachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                historyId: params.historyId
            }
        });

        return NextResponse.json(attachment);

    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}