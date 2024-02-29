"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogDescription,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Company } from '@prisma/client';
import { Input } from '@/components/ui/input';

interface CancelingModalProps {
    children: React.ReactNode;
    onConfirm: (params: any) => void;
    initialData: Company
};

const formSchema = z.object({
    cancelSubscriptionDate: z.date({
        required_error: "Selecione a data do cancelamento",
    }),
    cancelSubscriptionReason: z.string().min(1, {
        message: "Especifique o motivo do cancelamento."
    })
})

export const CancelingModal = ({
    children,
    onConfirm,
    initialData
}: CancelingModalProps) => {
    const [reason, setReason] = useState('')
    const [cancelDate, setCancelDate] = useState<Date | undefined>(new Date())

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <Form {...form}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Cancelamento de assinatura
                        </AlertDialogTitle>


                        <FormField
                            control={form.control}
                            name='cancelSubscriptionReason'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder='Diga o motivo do cancelamento...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !cancelDate && "text-muted-foreground"
                                    )}
                                >
                                    {cancelDate ? (
                                        format(cancelDate, "PP")
                                    ) : (
                                        <span>Escolha uma data</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0' align='start'>
                                <Calendar
                                    mode='single'
                                    selected={cancelDate}
                                    onSelect={() => console.log('qualé')}

                                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                        <AlertDialogDescription>
                            Essa ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancelar
                        </AlertDialogCancel>
                        <Button>
                            Confirmar
                        </Button>
                    </AlertDialogFooter>

                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
};