"use client";

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Company, Course } from '@prisma/client';
import { IMaskInput } from 'react-imask';
import IMask from 'imask';

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
import { Textarea } from '@/components/ui/textarea';



interface CompanyDocumentFormProps {
    initialData: Company;
    companyId: string;
};

const formSchema = z.object({
    documentNumber: z.string().min(14, {
        message: "Coloque um documento válido"
    }),
});

export const CompanyDocumentForm = ({
    initialData,
    companyId
}: CompanyDocumentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const mask = IMask.createMask({
        mask: [{ mask: "000.000.000-00" }, { mask: "00.000.000/0000-00" }]
    })

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            documentNumber: initialData?.documentNumber || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/companies/${companyId}`, values);
            toast.success("CPF/CNPJ atualizado!");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Aconteceu algo errado!");
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                CNPJ ou CPF
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
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.documentNumber && "text-slate-500 italic"
                )}>
                    {initialData.documentNumber || "CNPJ ou CPF não informado"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4 mt-4'
                    >
                        <FormField
                            control={form.control}
                            name='documentNumber'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <IMaskInput
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            mask={mask}
                                            type='text'
                                            disabled={isSubmitting}
                                            placeholder="Ex: 12.345.678/0001-00"
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