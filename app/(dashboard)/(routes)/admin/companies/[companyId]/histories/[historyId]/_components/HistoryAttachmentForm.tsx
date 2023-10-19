"use client";

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { History, historyAttachment } from '@prisma/client';



import { Button } from '@/components/ui/button';
import { File, Loader2, PlusCircle, X } from 'lucide-react';

import { FileUpload } from '@/components/FileUpload';



interface HistoryAttachmentFormProps {
    initialData: History & { attachments: historyAttachment[] };
    historyId: string;
    companyId: string
};

const formSchema = z.object({
    url: z.string().min(1),
});

export const HistoryAttachmentForm = ({
    initialData,
    historyId,
    companyId
}: HistoryAttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const anexo = { ...values, historyId }

        try {
            await axios.post(`/api/companies/${companyId}/histories/${historyId}/attachments`, anexo);
            toast.success("Anexo adicionado");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Aconteceu algo errado");
        }
    };

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/companies/${companyId}/histories/${historyId}/attachments/${id}`);
            toast.success("Anexo deletado com sucesso");
            router.refresh();
        } catch (error) {
            toast.error("Aconteceu algo errado")
        } finally {
            setDeletingId(null);
        }
    }



    return (
        <div className='border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Arquivos anexos
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && (
                        <>Cancelar</>
                    )}

                    {!isEditing && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Adicionar
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments?.length === 0 && (
                        <p className='text-sm mt-2 text-slate-500 italic'>
                            Sem anexos.
                        </p>
                    )}
                    {initialData.attachments?.length > 0 && (
                        <div className='space-y-2'>
                            {initialData.attachments.map((attachment) => (
                                <a
                                    href={attachment.url}
                                    target='_blank'
                                    key={attachment.id}
                                    className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'
                                >
                                    <File className='h-4 w-4 mr-2 flex-shrink-0' />
                                    <p className='text-xs line-clamp-none flex-shrink-0 mr-2 font-semibold'>
                                        Adicionado em {attachment.createdAt.toLocaleString()}
                                    </p>
                                    <p className='text-xs line-clamp-1'>
                                        | {attachment.name}
                                    </p>
                                    {deletingId === attachment.id && (
                                        <div className='ml-auto'>
                                            <Loader2 className='h-4 w-4 animate-spin' />
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <button
                                            onClick={() => onDelete(attachment.id)}
                                            className='ml-auto hover:opacity-75 transition'
                                        >
                                            <X className='h-4 w-4' />
                                        </button>
                                    )}
                                </a>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="historyAttachment"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ url: url })
                            }
                        }}
                    />
                    <div className='text-xs text-muted-foreground mt-4'>
                        Add anything your students might need to complete the course.
                    </div>
                </div>
            )}
        </div>
    )
}