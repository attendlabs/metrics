"use client";

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Company, Payment } from '@prisma/client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Banknote, CalendarIcon, Loader2, Pencil, PlusCircleIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from "date-fns";
import { Calendar } from '@/components/ui/calendar';


interface PaymentFormProps {
    initialData: Company & { finances: Payment[] };
    companyId: string;
};

const formSchema = z.object({
    value: z.coerce.number(),
    discount: z.coerce.number().optional(),
    netValue: z.coerce.number().optional(),
    description: z.string().min(4, "Mínimo de 4 caracteres").optional(),
    paymentDate: z.date({
        required_error: "Selecione a data do pagamento.",
    }),
});

export const PaymentForm = ({
    initialData,
    companyId
}: PaymentFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [discounted, setDiscounted] = useState(0);



    const toggleCreating = () => {
        setIsCreating((current) => !current);
    };
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: undefined,
            paymentDate: new Date(),
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {


        const model = {
            value: values.value,
            companyId: companyId,
            paymentDate: values.paymentDate,
            discount: values.discount,
            netValue: values.netValue,
            description: values.description
        }

        try {
            await axios.post(`/api/companies/${companyId}/finances`, model);
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


    console.log(discounted)

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            {isUpdating && (
                <div className='absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center'>
                    <Loader2 className='animate-spin h-6 w-6 text-sky-700' />
                </div>
            )}
            <div className='font-medium flex items-center justify-between'>
                {isCreating ? "Novo pagamento" : "Últimos pagamentos"}
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
                            name='paymentDate'
                            render={({ field }) => (
                                <FormItem className='flex flex-col'>
                                    <FormLabel>
                                        Data do pagamento
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PP")
                                                    ) : (
                                                        <span>Escolha uma data</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0' align='start'>
                                            <Calendar
                                                mode='single'
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='value'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Valor bruto
                                    </FormLabel>
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
                        <FormField
                            control={form.control}
                            name='discount'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Desconto
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            disabled={isSubmitting}
                                            placeholder='120,00'
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='netValue'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Valor líquido
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled
                                            placeholder={'23'}
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Observação <span className='font-normal text-gray-500'>(opcional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder='Escreva suas observações'
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
                                <p className='text-xs font-medium line-clamp-1'>
                                    {payment.paymentDate?.toLocaleDateString() || "Sem data"} - Valor: R${payment.value}
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