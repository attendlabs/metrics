"use client";

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Company, History } from '@prisma/client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { File, Loader2, Pencil, PlusCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { setDate } from 'date-fns';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Textarea } from '@/components/ui/textarea';




interface HistoryFormProps {
    initialData: Company & { histories: History[] };
    companyId: string;
};

const formSchema = z.object({
    title: z.string().min(1),
});

export const HistoryForm = ({
    initialData,
    companyId
}: HistoryFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleCreating = () => {
        setIsCreating((current) => !current);
    };

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/companies/${companyId}/histories`, values);
            toast.success("Histórico criado.");
            toggleCreating();
            router.refresh();
        } catch (error) {
            toast.error("Aconteceu algo errado");
        }
    };


    const onEdit = (id: string) => {
        router.push(`/admin/companies/${companyId}/histories/${id}`);
    }

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/companies/${companyId}/histories/${id}`);
            toast.success("Histórico apagado");
            router.refresh();
        } catch (error) {
            toast.error("Aconteceu algo errado")
        } finally {
            setDeletingId(null);
        }
    }


    console.log(initialData);

    return (
        <div className='relative mt-6 border bg-slate-100 rounded-md p-4'>
            {isUpdating && (
                <div className='absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center'>
                    <Loader2 className='animate-spin h-6 w-6 text-sky-700' />
                </div>
            )}
            <div className='font-medium flex items-center justify-between'>
                Observações
                <Button variant="ghost" onClick={toggleCreating}>
                    {isCreating
                        ? (
                            <>Cancelar</>)
                        : (
                            <>
                                <PlusCircle className='h-4 w-4 mr-2' />
                                Adicionar
                            </>
                        )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4 mt-4'
                    >
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Introduction'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Salvar
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.histories?.length && "text-slate-500 italic"
                )}>
                    {!initialData.histories?.length && "Sem históricos."}
                    <div className='space-y-2'>
                        {initialData.histories.map((history) => (
                            <div
                                key={history.id}
                                className='flex items-center px-2 py-1 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'
                            >
                                <File className='h-4 w-4 mr-2 flex-shrink-0' />
                                <p className='text-xs line-clamp-1'>
                                    {history.title}
                                </p>
                                <div className='flex ml-auto'>
                                    <button
                                        className='rounded-full hover:bg-slate-400/20 p-2 transition'
                                        onClick={() => onEdit(history.id)}>
                                        <Pencil className='h-4 w-4' />
                                    </button>
                                    <ConfirmModal onConfirm={() => onDelete(history.id)}>
                                        <button
                                            className='rounded-full hover:bg-slate-400/20 p-2 transition'
                                        >
                                            <X className='h-4 w-4' />
                                        </button>
                                    </ConfirmModal>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            )}
            {!isCreating && (
                <p className='text-xs mt-4 text-muted-foreground'>
                    Você pode alterar essas observações a qualquer momento.
                </p>
            )}
        </div>
    )
}