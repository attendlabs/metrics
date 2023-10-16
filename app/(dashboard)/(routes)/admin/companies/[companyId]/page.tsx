import React from 'react';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { IconBadge } from '@/components/IconBadge';
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react';
import { CompanyNameForm } from './_components/CompanyNameForm';
import { CompanyEmailForm } from './_components/CompanyEmailForm';
import { ImageForm } from './_components/ImageForm';
import { PriceForm } from './_components/PriceForm';
import { InitialSubscriptionDateForm } from './_components/InitialSubscriptionDateForm';
import { AttachmentForm } from './_components/AttachmentForm';
import { ChaptersForm } from './_components/ChaptersForm';
import { Banner } from '@/components/Banner';
import { Actions } from './_components/Actions';
import { PhoneForm } from './_components/PhoneForm';

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
    });

    // const categories = await db.category.findMany({
    //     orderBy: {
    //         name: "asc",
    //     }
    // })

    if (!company) {
        redirect("/");
    }

    // const requiredFields = [
    //     course.title,
    //     course.description,
    //     course.imageUrl,
    //     course.price,
    //     course.categoryId,
    //     course.chapters.some(chapter => chapter.isPublished),
    // ];

    // const totalFields = requiredFields.length;
    // const completedFields = requiredFields.filter(Boolean).length;

    // const completionText = `(${completedFields}/${totalFields})`;

    // const isComplete = requiredFields.every(Boolean);

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
                            Preencha todos os requisitos.
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

                        <CompanyEmailForm
                            initialData={company}
                            companyId={company.id}
                        />
                        <PhoneForm
                            initialData={company}
                            companyId={company.id}
                        />

                        <InitialSubscriptionDateForm
                            initialData={company}
                            companyId={company.id}
                        />
                    </div>
                    <div className='space-y-6'>
                        {/* <div>
                            <div className='flex items-center gap-x-2'>
                                <IconBadge icon={ListChecks} />
                                <h2 className='text-xl'>
                                    Course chapters
                                </h2>
                            </div>
                            <ChaptersForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div> */}
                        <div>
                            <div className='flex items-center gap-x-2'>
                                <IconBadge icon={CircleDollarSign} />
                                <h2 className='text-xl'>
                                    Financeiro
                                </h2>
                            </div>
                            {/* <PriceForm
                                initialData={course}
                                courseId={course.id}
                            /> */}
                        </div>
                        {/* <div>
                            <div className='flex items-center gap-x-2'>
                                <IconBadge icon={File} />
                                <h2 className='text-xl'>
                                    Resources & Attachments
                                </h2>
                            </div>
                            <AttachmentForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompanyIdPage