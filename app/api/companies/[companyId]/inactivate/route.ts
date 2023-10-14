import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { companyId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const company = await db.company.findUnique({
            where: {
                id: params.companyId,
            }
        });

        if (!company) {
            return new NextResponse("Not Found", { status: 404 });
        }


        const inactivatedCompany = await db.company.update({
            where: {
                id: params.companyId
            },
            data: {
                isActive: false,
            },
        });

        return NextResponse.json(inactivatedCompany);
    } catch (error) {
        console.log("[COMPANY_ID_INACTIVATE", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}