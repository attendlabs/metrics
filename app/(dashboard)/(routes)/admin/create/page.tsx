"use client";
import React from 'react';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import toast from "react-hot-toast";

// todo: translation on toasts

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Nome da empresa é obrigatório.",
    }),
});

const CreatePage = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/companies", values);
            router.push(`/admin/companies/${response.data.id}`);
            toast.success("Empresa criada com sucesso.");
        } catch (error) {
            toast.error("Aconteceu algo errado.")
        }
    };



    return (
        <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'>
            <div>
                <h1 className='text-2xl'>
                    Nome da empresa
                </h1>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 mt-8"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Nome da empresa
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Ex: Creche Canina ABC"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Não se preocupe, você pode alterar isso mais tarde.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex items-center gap-x-2'>
                            <Link href={'/'}>
                                <Button
                                    variant="ghost"
                                    type='button'
                                >
                                    Cancelar
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Continuar
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default CreatePage