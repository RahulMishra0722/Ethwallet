"use client"; // Add this directive to indicate the file is a client component

import Image from 'next/image';
import { Button } from "@/components/ui/button";
import React from 'react';
import axios from 'axios';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { encodeData } from '@/extras/encrypt';
import bcrypt from 'bcryptjs'; // Use 'bcryptjs' instead for client-side

type Data = {
  Publickey: string;
  Adress: string;
  Mnemonic: string;
};

async function hashString(secretPhrase: string) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(secretPhrase, salt);
  return hashedPassword;
}

async function removeSpaces(str: string) {
  return str.replace(/\s+/g, '');
}

export default function Home() {
  const [secretPhrase, setSecretPhrase] = React.useState<string>("");
  const [data, setData] = React.useState<Data | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState<boolean>(true);

  const router = useRouter();

  const createWallet = async () => {
    try {
      const d = await removeSpaces(secretPhrase);
      const secret = await hashString(d);
      localStorage.setItem('secret', secret);
      const response = await axios.get('/api/wallets');
      setSecretPhrase(response.data.Mnemonic);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching wallet:", error);
    }
  };


  const formatSecretPhrase = (phrase: string) => {
    const words = phrase.split(' ');
    const groups = [];
    for (let i = 0; i < words.length; i += 3) {
      groups.push(words.slice(i, i + 3).join(' '));
    }
    return groups.join('\n');
  };

  const handleAccountCreation = async () => {

    if (!data) {
      console.error("No data available");
      return;
    }
    try {
      const en = {
        Publickey: data.Publickey,
        Adress: data.Adress,
      };
      const encodedData = encodeData(en);

      router.push(`/createPassword/?key=${encodedData}`);
    } catch (error) {
      console.error("Error during account creation:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      {secretPhrase.length === 0 ? (
        <div className="flex items-center">
          <Image
            src="https://i.pinimg.com/originals/45/8e/33/458e33a362e15971fac99babbe08e1b0.png"
            alt="Logo"
            width={50}
            height={50}
            className="mr-2"
          />
          <Button onClick={createWallet}>Create wallet</Button>
        </div>
      ) : (
        <Card className="w-[500px] h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className='text-xl justify-center flex items-center'>Secret Phrase</CardTitle>
            <CardDescription>
              Store this safely somewhere; if you lose it, you won’t be able to change your password if you forget it.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-4">
            <pre className="font-mono whitespace-pre-wrap p-6 rounded-lg shadow-md overflow-auto ml-100">
              {formatSecretPhrase(secretPhrase)}
            </pre>
          </CardContent>
          <CardFooter className="flex flex-col mt-auto space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox onClick={() => setIsButtonDisabled(prev => !prev)} id="terms1" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Are you sure you have saved it safely?
                </label>
                <p className="text-sm text-muted-foreground">
                  Check the box if you have
                </p>
              </div>
            </div>
            <Button onClick={handleAccountCreation} disabled={isButtonDisabled}>Continue</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
