"use client";

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Chapter, History, Payment } from '@prisma/client';

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
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Editor } from '@/components/Editor';
import { Preview } from '@/components/Preview';
import { formatPrice } from '@/lib/format';


//TODO: consertar valor liquido, calculo e patch

interface PaymentValueFormProps {
    initialData: Payment;
    companyId: string
    paymentId: string;
};

const formSchema = z.object({
    value: z.coerce.number(),
    discount: z.coerce.number(),
    netValue: z.coerce.number(),
});

export const PaymentValueForm = ({
    initialData,
    companyId,
    paymentId
}: PaymentValueFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [netValue, setNetValue] = useState(0);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: initialData?.value
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        const model = {
            value: values.value,
            discount: values.discount,
            netValue: netValue,
        }

        try {
            await axios.patch(`/api/companies/${companyId}/finances/${paymentId}`, model);
            toast.success("Valor total alterado");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Aconteceu algo errado");
        }
    }

    const watchValues = form.watch();

    useEffect(() => {
        const value = watchValues.value;
        const discount = watchValues.discount || 0;
        const netValue = value - discount;
        return setNetValue(netValue);
    }, [watchValues])

    return (
        <div className='border bg-slate-100 rounded-md p-4'>
            <div className={cn(
                'font-medium flex items-center justify-between',
                isEditing && "text-sm -mb-4"
            )}>
                Valor total
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing
                        ? (
                            <>Cancelar</>)
                        : (
                            <>
                                <Pencil className='h-4 w-4 mr-2' />
                                Editar
                            </>
                        )}
                </Button>
            </div>
            {!isEditing && (
                <div className='flex flex-col gap-y-2'>
                    <div className={cn(
                        "text-sm",
                        !initialData.value && "text-slate-500 italic"
                    )}>
                        {!initialData.value && "No description"}
                        {formatPrice(initialData.value)}
                    </div>
                    <div className='font-medium flex items-center justify-between'>
                        Desconto
                    </div>
                    <div className={cn(
                        "text-sm",
                        !initialData.discount && "text-slate-500 italic"
                    )}>
                        {initialData.discount && formatPrice(initialData.discount) || "R$ 0,00"}
                    </div>
                    <div className='font-medium flex items-center justify-between'>
                        Valor líquido
                    </div>
                    <div className={cn(
                        "text-sm",
                        !initialData.netValue && "text-slate-500 italic"
                    )}>
                        {initialData.netValue && formatPrice(initialData.netValue)}
                    </div>
                </div>
            )}




            {isEditing && (
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
                                            type="number"
                                            step="0.01"
                                            disabled={isSubmitting}
                                            placeholder='R$ 2000,00'
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
                                            placeholder=''
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
                                            value={formatPrice(netValue)}
                                        />
                                    </FormControl>
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
        </div>
    )
}