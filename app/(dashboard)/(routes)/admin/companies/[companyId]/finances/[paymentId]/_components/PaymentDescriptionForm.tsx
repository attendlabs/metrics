"use client";

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Chapter, History, Payment } from '@prisma/client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Editor } from '@/components/Editor';
import { Preview } from '@/components/Preview';


//todo: translation on form message

interface PaymentDescriptionFormProps {
    initialData: Payment;
    companyId: string
    paymentId: string;
};

const formSchema = z.object({
    description: z.string().min(1),
});

export const PaymentDescriptionForm = ({
    initialData,
    companyId,
    paymentId
}: PaymentDescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/companies/${companyId}/finances/${paymentId}`, values);
            toast.success("Descrição alterada");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Aconteceu algo errado");
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Descrição
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
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.description && "text-slate-500 italic"
                )}>
                    {!initialData.description && "No description"}
                    {initialData.description}
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
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Ex: Feedback sobre app"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex items-center gap-x-2'>
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Salvar
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}