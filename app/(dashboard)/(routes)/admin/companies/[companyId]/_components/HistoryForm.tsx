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
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarIcon, File, Loader2, Pencil, PlusCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';




interface HistoryFormProps {
    initialData: Company & { histories: History[] };
    companyId: string;
};

const formSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    historyDate: z.date({
        required_error: "Selecione a data.",
    }),
});

export const HistoryForm = ({
    initialData,
    companyId
}: HistoryFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);


    const toggleCreating = () => {
        setIsCreating((current) => !current);
    };

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            historyDate: new Date()
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/companies/${companyId}/histories`, values);
            toast.success("Histórico criado");
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
            await axios.delete(`/api/companies/${companyId}/histories/${id}`);
            toast.success("Histórico apagado");
            router.refresh();
        } catch (error) {
            toast.error("Aconteceu algo errado")
        }
    }



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
                                    <FormLabel>
                                        Título
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Ex: Feedback do cliente sobre App"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Descrição
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="Ex: o cliente não conseguiu usar o app"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='historyDate'
                            render={({ field }) => (
                                <FormItem className='flex flex-col'>
                                    <FormLabel>
                                        Data da ocorrência
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
                        {initialData.histories.slice(0, 3).map((history) => (
                            <div
                                key={history.id}
                                className='flex items-center px-2 py-1 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'
                            >
                                <File className='h-4 w-4 mr-2 flex-shrink-0' />
                                <p className='text-xs mr-2 font-semibold'>
                                    {format(history.historyDate, "dd/MM/yyyy")}
                                </p>
                                <p className='text-xs line-clamp-1'>
                                    -  {history.title}
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