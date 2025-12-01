"use client";

import Image from "next/image";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInSchema } from "@/zod/sign-in";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

type SignInFormValues = z.infer<typeof signInSchema>;

function SignInForm() {
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const router = useRouter();

  async function onSubmit(data: SignInFormValues) {
    const loadingToast = toast.loading("Sedang masuk...", {
      description: "Mohon tunggu sebentar",
      duration: Infinity,
    });

    const { nim, password } = data;

    const formData = new FormData();
    formData.append("nim", nim);
    formData.append("password", password);

    const res = await signIn("credentials", {
      username: nim,
      password: password,
      redirect: false,
    });

    toast.dismiss(loadingToast);

    if (!res?.ok) {
      toast.error("Gagal masuk", {
        description: "Silakan coba lagi",
      });
      return;
    }

    toast.success("Berhasil masuk", {
      description: "Selamat datang Admin",
    });

    router.push("/");
    router.refresh();
  }

  return (
    <section className="flex w-full max-w-xl flex-col gap-12 rounded-md bg-[#272727] px-8 py-12 text-white">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">Login</p>
        <Image
          src="/logos/hmtg-gea-itb.jpg"
          alt="GEA"
          width={895}
          height={603}
          className="w-[80px]"
        />
      </div>

      {/* Card Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center space-y-8"
        >
          <FormField
            control={form.control}
            name="nim"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-bold">NIM</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan NIM Anda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full pb-8">
                <FormLabel className="font-bold">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Masukkan Password Anda"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="rounded-full bg-[#A12C22] px-8 font-bold hover:bg-[#A12C22]/90"
          >
            Login
          </Button>
        </form>
      </Form>
    </section>
  );
}

export default SignInForm;
