"use client";

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Company, Course } from '@prisma/client';
import { format } from "date-fns";

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
import { Pencil, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { ComboBox } from '@/components/ui/combobox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ptBR } from 'date-fns/locale';


interface EndSubscriptionDateFormProps {
    initialData: Company;
    companyId: string;
};

const formSchema = z.object({
    subscriptionEnd: z.date({
        required_error: "Selecione uma data válida.",
    }),
});

export const EndSubscriptionDateForm = ({
    initialData,
    companyId,
}: EndSubscriptionDateFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/companies/${companyId}`, values);
            toast.success("Dados de empresa atualizados.");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Aconteceu algo errado.");
        }
    }



    return (
        <div className={cn(
            'mt-6 border bg-slate-100 rounded-md p-4'
        )}>
            <div className={cn(
                "font-medium flex items-center justify-between"
            )}>
                Fim da assinatura
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
                <>
                    <div className='flex items-center gap-x-2'>
                        <p className={cn(
                            "text-sm font-medium text-slate-700",
                            !initialData.subscriptionEnd && "text-slate-500 font-normal italic"
                        )}>
                            {initialData.subscriptionEnd && format(initialData.subscriptionEnd, "dd/MM/yyyy") || "Insira uma data"}
                        </p>
                    </div>
                </>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4 mt-4'
                    >
                        <FormField
                            control={form.control}
                            name='subscriptionEnd'
                            render={({ field }) => (
                                <FormItem className='flex flex-col'>
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
                                                disabled={(date) => {
                                                    if (!initialData.subscriptionDate) {
                                                        return (date < new Date("1900-01-01"))
                                                    }
                                                    return (
                                                        date < initialData.subscriptionDate
                                                    )
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
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