"use client";

import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from 'react-hook-form';

const schema = z.object({
    password: z.string()
        .min(5, {
            message: "Password should be at least 5 characters.",
        })
        .max(50, {
            message: "Password must be less than 50 characters.",
        }),
    publicKey: z.string().max(200, {
        message: 'Public key should not be more than 200 characters',
    })
});

export default function Login() {
    const search = useSearchParams();
    const publicKey = search.get('key');
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            password: "",
            publicKey: publicKey || "",
        },
    });

    async function onSubmit(values: z.infer<typeof schema>) {
        try {
            await axios.post('/api/login', {
                publicKey: values.publicKey,
                password: values.password,
            });
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <div className='justify-center flex items-center h-screen w-screen'>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle className='justify-center flex items-center'>Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type='password' placeholder="Enter your password" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Your password should be kept secret.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="publicKey"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Public Key</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="Enter your public key" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Your public key is required.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
