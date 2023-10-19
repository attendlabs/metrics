import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs";
import { isTeacher } from "@/lib/teacher";

const f = createUploadthing();

const handleAuth = () => {
    const { userId } = auth();
    const isAuthorized = true;

    if (!userId || !isAuthorized) throw new Error("Unauthorized");
    return { userId };
}


export const ourFileRouter = {
    historyAttachment: f(["text", "image", "video", "audio", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;