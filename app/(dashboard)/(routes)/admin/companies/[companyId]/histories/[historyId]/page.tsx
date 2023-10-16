import { IconBadge } from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChapterTitleForm } from "./_components/ChapterTitleForm";
import { ChapterDescriptionForm } from "./_components/ChapterDescriptionForm";
import { ChapterAccessForm } from "./_components/ChapterAccessForm";
import { ChapterVideoForm } from "./_components/ChapterVideoForm";
import { Banner } from "@/components/Banner";


const ChapterIdPage = async ({
    params
}: {
    params: { companyId: string; historyId: string }
}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const history = await db.history.findUnique({
        where: {
            id: params.historyId,
            companyId: params.companyId
        }
    });

    if (!history) {
        return redirect("/");
    }




    return (
        <>
            {!history.isPublished && (
                <Banner
                    variant="warning"
                    label="This chapter is unpublished. This will not be seen in the course"
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/admin/companies/${params.companyId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to course setup
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Chapter Creation
                                </h1>
                                <span className="text-sm text-slate-700">
                                    Complete all fields
                                </span>
                            </div>
                            <ChapterActions
                                companyId={params.companyId}
                                historyId={params.historyId}
                                isPublished={history.isPublished}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Costumize your chapter
                                </h2>
                            </div>
                            {/* <ChapterTitleForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            /> */}
                            {/* <ChapterDescriptionForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            /> */}
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Eye} />
                                <h2 className="text-xl">
                                    Access settings
                                </h2>
                            </div>
                            {/* <ChapterAccessForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            /> */}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Video} />
                            <h2 className="text-xl">
                                Add a video.
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default ChapterIdPage;