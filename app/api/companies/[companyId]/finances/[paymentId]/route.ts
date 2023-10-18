import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { companyId: string; paymentId: string } }
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
        })

        if (!ownCompany) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const payment = await db.payment.findUnique({
            where: {
                id: params.paymentId,
                companyId: params.companyId,
            }
        })

        if (!payment) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const deletedPayment = await db.payment.delete({
            where: {
                id: params.paymentId
            }
        });

        return NextResponse.json(deletedPayment);
    } catch (error) {
        console.log("[DELETE_PAYMENT]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { companyId: string; paymentId: string } }
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

        const updatedPayment = await db.payment.update({
            where: {
                id: params.paymentId,
                companyId: params.companyId
            },
            data: {
                ...values
            }
        });

        return NextResponse.json(updatedPayment);

    } catch (error) {
        console.log("[PAYMENT_ID_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}