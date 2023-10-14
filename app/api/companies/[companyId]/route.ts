import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { companyId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const company = await db.company.findUnique({
            where: {
                id: params.companyId,
            },
        });

        if (!company) {
            return new NextResponse("Not Found", { status: 404 });
        }


        const deletedCompany = await db.company.delete({
            where: {
                id: params.companyId,
            },
        });

        return NextResponse.json(deletedCompany);
    } catch (error) {
        console.log("[COMPANY_DELETE", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { companyId: string } }
) {
    try {
        const { userId } = auth();
        const { companyId } = params;
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const company = await db.company.update({
            where: {
                id: companyId,
            },
            data: {
                ...values,
            }
        });
        return NextResponse.json(company);

    } catch (error) {
        console.log("[COMPANY_ID]", error);
        return new NextResponse("Internal Error", { status: 500 })
    };
};