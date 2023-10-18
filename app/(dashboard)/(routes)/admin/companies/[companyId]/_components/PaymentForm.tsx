"use client";

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Company, Course, Payment } from '@prisma/client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Banknote, CircleDollarSignIcon, File, Loader2, Pencil, PlusCircleIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import { ConfirmModal } from '@/components/modals/ConfirmModal';


interface PaymentFormProps {
    initialData: Company & { finances: Payment[] };
    companyId: string;
};

const formSchema = z.object({
    value: z.coerce.number(),
});

export const PaymentForm = ({
    initialData,
    companyId
}: PaymentFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);


    const toggleCreating = () => {
        setIsCreating((current) => !current);
    };
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: undefined,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/companies/${companyId}/finances`, values);
            toast.success("Pagamento adicionado");
            toggleCreating();
            router.refresh();
        } catch (error) {
            toast.error("Aconteceu algo errado");
        }
    }

    const onEdit = (id: string) => {
        router.push(`/admin/companies/${companyId}/finances/${id}`);
    }

    const onDelete = async (id: string) => {
        try {
            await axios.delete(`/api/companies/${companyId}/finances/${id}`);
            toast.success("Pagamento excluído");
            router.refresh();
        } catch (error) {
            toast.error("Aconteceu algo errado")
        }
    }

    console.log(initialData, "aqui")

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            {isUpdating && (
                <div className='absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center'>
                    <Loader2 className='animate-spin h-6 w-6 text-sky-700' />
                </div>
            )}
            <div className='font-medium flex items-center justify-between'>
                Últimos pagamentos
                <Button variant="ghost" onClick={toggleCreating}>
                    {isCreating
                        ? (<>Cancelar</>)
                        : (<>
                            <PlusCircleIcon className='h-4 w-4 mr-2' />
                            Adicionar
                        </>)}
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
                            name='value'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='2000,00'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type='submit'
                        >
                            Salvar
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.finances?.length && "text-slate-500 italic"
                )}>
                    {!initialData.finances?.length && "Não há pagamentos."}
                    <div className='space-y-2'>
                        {initialData.finances?.map((payment) => (
                            <div
                                key={payment.id}
                                className='flex items-center px-2 py-1 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'
                            >
                                <Banknote className='h-4 w-4 mr-2 flex-shrink-0' />
                                {/* TODO:alterar data para a data do pagamento ao invés da data de criação */}
                                <p className='text-xs font-medium line-clamp-1'>
                                    {payment.createdAt.toLocaleDateString()} - Valor: R${payment.value}
                                </p>
                                <div className='flex ml-auto'>
                                    <button
                                        className='rounded-full hover:bg-slate-400/20 p-2 transition'
                                        onClick={() => onEdit(payment.id)}>
                                        <Pencil className='h-4 w-4' />
                                    </button>
                                    <ConfirmModal onConfirm={() => onDelete(payment.id)}>
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
        </div>
    )
}