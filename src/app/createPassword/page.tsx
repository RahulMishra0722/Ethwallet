"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
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
import { Suspense } from "react";
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
    reTypedPassword: z.string()
        .min(5, {
            message: "Password should be at least 5 characters.",
        })
        .max(50, {
            message: "Password must be less than 50 characters.",
        }),
});

export default function SetPassword() {
    const search = useSearchParams();
    const key = search.get('key');
    const [data, setData] = useState<{ Publickey: string; Adress: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSignUpSuccessfull, setIsSignUpSuccessfull] = useState<boolean>(false)

    const router = useRouter()

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            password: "",
            reTypedPassword: ""
        }
    });


    const handleLogin = (publicKey: string) => {
        router.push(`/login/?key=${publicKey}`);
    };

    useEffect(() => {
        if (key) {
            axios.get(`/api/decode?key=${encodeURIComponent(key)}`)
                .then(response => {
                    setData(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching decoded data:', error);
                    setError('Failed to fetch data');
                    setLoading(false);
                });
        }
    }, [key]);

    async function onSubmit(values: z.infer<typeof schema>) {
        if (values.password !== values.reTypedPassword) {
            alert('Passwords do not match');
        } else {
            const phrase = localStorage.getItem('secret');

            try {
                const response = await axios.post('/api/create-user', {
                    publicKey: data?.Publickey,
                    address: data?.Adress,
                    password: values.password,
                    resetPassPhrase: phrase
                });
                if (response.status < 250) {
                    setIsSignUpSuccessfull(true)
                }


            } catch (error) {
                console.error('Error creating user:', error);

            }
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data) return <div>Error: No data found</div>;

    return (
        <div>
            <h1>...</h1>
            <Suspense fallback={<>Loading...</>}>
                <div className='justify-center flex items-center h-screen w-screen'>
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Create Project</CardTitle>
                            <CardDescription>Deploy your new project in one-click.</CardDescription>
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
                                        name="reTypedPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Re-type Password</FormLabel>
                                                <FormControl>
                                                    <Input type='password' placeholder="Re-enter your password" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Re-type your password to confirm.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Submit</Button>
                                </form>
                            </Form>
                        </CardContent>
                        {isSignUpSuccessfull && `Your pub key: ${data.Publickey}`}
                        {isSignUpSuccessfull && <Button onClick={() => handleLogin(data.Publickey)}>Login</Button>}
                    </Card>

                </div>
            </Suspense>
        </div>
    );
}
