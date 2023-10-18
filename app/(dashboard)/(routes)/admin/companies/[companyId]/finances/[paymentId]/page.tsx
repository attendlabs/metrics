import { IconBadge } from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, Video, File } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HistoryTitleForm } from "./_components/HistoryTitleForm";
import { HistoryActions, PaymentActions } from "./_components/HistoryActions";


const PaymentIdPage = async ({
    params
}: {
    params: { companyId: string; paymentId: string }
}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const payment = await db.payment.findUnique({
        where: {
            id: params.paymentId,
            companyId: params.companyId
        }
    });

    if (!payment) {
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
                                Edição de pagamento
                            </h1>
                            <span className="text-sm text-slate-700">
                                Preencha os campos com atenção
                            </span>
                        </div>
                        <PaymentActions
                            companyId={params.companyId}
                            paymentId={params.paymentId}
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-4">
                    <div>

                        Teste
                        {/* <HistoryTitleForm
                            initialData={history}
                            companyId={params.companyId}
                            historyId={params.historyId}
                        /> */}
                        {/* <ChapterDescriptionForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            /> */}
                    </div>
                    {/* Abaixo do primeiro */}
                </div>
                <div className="text-sm text-gray-400 italic">
                    Teste
                </div>
                {/* direito do grid */}
            </div>
        </div>

    )
};

export default PaymentIdPage;