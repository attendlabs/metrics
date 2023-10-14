import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { string } from "zod";

// isAdmin mocado para dev, alterar em prod
const isAdmin = true;

export async function POST(
    req: Request,
) {
    try {
        const { userId } = auth();
        const { name } = await req.json();

        if (!userId || !isAdmin) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const course = await db.company.create({
            data: {
                name,
            }
        });


        return NextResponse.json(course);

    } catch (error) {
        console.log("[COMPANIES]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }

}