import React from 'react';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { IconBadge } from '@/components/IconBadge';
import { CircleDollarSign, File, LayoutDashboard, ListChecks, CalendarCheck2 } from 'lucide-react';
import { CompanyNameForm } from './_components/CompanyNameForm';
import { CompanyEmailForm } from './_components/CompanyEmailForm';
import { InitialSubscriptionDateForm } from './_components/InitialSubscriptionDateForm';
import { Banner } from '@/components/Banner';
import { Actions } from './_components/Actions';
import { PhoneForm } from './_components/PhoneForm';
import { SignatureTypeForm } from './_components/SignatureTypeForm';
import { EndSubscriptionDateForm } from './_components/EndSubscriptionDateForm';
import { HistoryForm } from './_components/HistoryForm';
import { CompanyDocumentForm } from './_components/CompanyDocumentForm';
import { PaymentForm } from './_components/PaymentForm';
import { DatabaseIdForm } from './_components/DatabaseIdForm';
import { Button } from '@/components/ui/button';
import { CancelSubscriptionForm } from './_components/CancelSubscriptionForm';


const CompanyIdPage = async ({
    params
}: {
    params: { companyId: string }
}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const company = await db.company.findUnique({
        where: {
            id: params.companyId
        },
        include: {
            histories: {
                orderBy: {
                    createdAt: "desc"
                }
            },
            finances: {
                orderBy: {
                    paymentDate: "desc"
                }
            }
        }
    });



    if (!company) {
        redirect("/");
    }

    return (
        <>
            {!company.isActive && (
                <Banner
                    label='Esta empresa está inativa.'
                />
            )}
            <div className='p-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex flex-col gap-y-2'>
                        <h1 className='text-2xl font-medium'>
                            Cadastro de empresa
                        </h1>
                        <span className='text-sm text-slate-00'>
                            Preencha todos os dados necessários.
                        </span>
                    </div>
                    <Actions
                        companyId={params.companyId}
                        isActive={company.isActive}
                    />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className='text-xl'>
                                Dados da Empresa
                            </h2>
                        </div>
                        <CompanyNameForm
                            initialData={company}
                            companyId={company.id}
                        />

                        <CompanyDocumentForm
                            initialData={company}
                            companyId={company.id}
                        />

                        <CompanyEmailForm
                            initialData={company}
                            companyId={company.id}
                        />
                        <PhoneForm
                            initialData={company}
                            companyId={company.id}
                        />

                    </div>
                    <div className='space-y-6'>
                        <div>
                            <div className='flex items-center gap-x-2'>
                                <IconBadge icon={ListChecks} />
                                <h2 className='text-xl'>
                                    Histórico
                                </h2>
                            </div>
                            <DatabaseIdForm
                                initialData={company}
                                companyId={company.id}
                            />
                            <HistoryForm
                                initialData={company}
                                companyId={company.id}
                            />
                        </div>
                        <div>
                            <div className='flex items-center gap-x-2'>
                                <IconBadge icon={CircleDollarSign} />
                                <h2 className='text-xl'>
                                    Financeiro
                                </h2>
                            </div>
                            <PaymentForm
                                initialData={company}
                                companyId={company.id}
                            />
                        </div>
                    </div>
                    <div>
                        <div className='flex items-center gap-x-2' id="#signature">
                            <IconBadge icon={CalendarCheck2} />
                            <h2 className='text-xl'>
                                Assinatura
                            </h2>
                        </div>

                        <CancelSubscriptionForm
                            initialData={company}
                            companyId={company.id}
                        />

                        <SignatureTypeForm
                            initialData={company}
                            companyId={company.id}
                        />

                        <InitialSubscriptionDateForm
                            initialData={company}
                            companyId={company.id}
                        />
                        <EndSubscriptionDateForm
                            initialData={company}
                            companyId={company.id}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompanyIdPage