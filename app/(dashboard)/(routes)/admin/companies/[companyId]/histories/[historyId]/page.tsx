import { IconBadge } from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, Video, File } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HistoryTitleForm } from "./_components/HistoryTitleForm";
import { HistoryActions } from "./_components/HistoryActions";
import { HistoryDescriptionForm } from "./_components/HistoryDescriptionForm";
import { HistoryAttachmentForm } from "./_components/HistoryAttachmentForm";
import { HistoryDateForm } from "./_components/HistoryDateForm";


const CompanyIdPage = async ({
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
        },
        include: {
            attachments: {
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    });

    if (!history) {
        return redirect("/");
    }




    return (

        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/admin/companies/${params.companyId}`}
                        className="flex items-center text-sm hover:opacity-70 transition mb-6 max-w-[80px]"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Edição de histórico
                            </h1>
                            <span className="text-sm text-slate-700">
                                Preencha os campos com atenção
                            </span>
                        </div>
                        <HistoryActions
                            companyId={params.companyId}
                            historyId={params.historyId}
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-4">
                    <div>
                        <HistoryTitleForm
                            initialData={history}
                            companyId={params.companyId}
                            historyId={params.historyId}
                        />
                        <HistoryDescriptionForm
                            initialData={history}
                            companyId={params.companyId}
                            historyId={params.historyId}
                        />
                        <HistoryDateForm
                            initialData={history}
                            historyId={params.historyId}
                            companyId={params.companyId}
                        />
                    </div>
                    {/* Abaixo do primeiro */}
                </div>
                <div>
                    {/* direito do grid */}
                    <div>
                        <HistoryAttachmentForm
                            initialData={history}
                            historyId={params.historyId}
                            companyId={params.companyId}
                        />
                    </div>
                </div>
            </div>
        </div>

    )
};

export default CompanyIdPage;