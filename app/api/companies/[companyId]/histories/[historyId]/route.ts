import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";


export async function DELETE(
    req: Request,
    { params }: { params: { companyId: string; historyId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCompany = await db.company.findUnique({
            where: {
                id: params.companyId,
            }
        });

        if (!ownCompany) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const history = await db.history.findUnique({
            where: {
                id: params.historyId,
                companyId: params.companyId,
            }
        });

        if (!history) {
            return new NextResponse("Not Found", { status: 404 });
        }


        const deletedHistory = await db.history.delete({
            where: {
                id: params.historyId,
            }
        });


        return NextResponse.json(deletedHistory);
    } catch (error) {
        console.log("[DELETE_HISTORY]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { companyId: string; historyId: string } }
) {
    try {
        const { userId } = auth();
        const { ...values } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCompany = await db.company.findUnique({
            where: {
                id: params.companyId,
            }
        });

        if (!ownCompany) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const updatedHistory = await db.history.update({
            where: {
                id: params.historyId,
                companyId: params.companyId
            },
            data: {
                ...values
            }
        });

        return NextResponse.json(updatedHistory);

    } catch (error) {
        console.log("[COMPANY_HISTORY_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}