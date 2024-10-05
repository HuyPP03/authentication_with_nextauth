/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import google from "@/app/assets/google.png";
import facebook from "@/app/assets/facebook.png";
import github from "@/app/assets/github.png";
import credentials from "@/app/assets/password.png";
import leftArrow from "@/app/assets/back.png";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function SignIn({ setAuthentication }: any) {
  const { toast } = useToast();
  const [openSignInWithCredentials, setOpenSignInWithCredentials] =
    useState<boolean>(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const data: any = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (data.status !== 200) {
        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
          ),
          variant: "destructive",
          description: data.error,
          duration: 2000,
        });
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center px-6 gap-6 mb-6">
      {openSignInWithCredentials ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-2 w-full"
        >
          <div className="w-full flex justify-start gap-2 mb-4">
            <div
              onClick={() => setOpenSignInWithCredentials(false)}
              className="cursor-pointer flex gap-2 font-semibold text-lg items-center"
            >
              <Image
                src={leftArrow.src}
                alt="left arrow"
                width={12}
                height={12}
                className="cursor-pointer w-4 h-4"
              />
              <p>Quay lại</p>
            </div>
          </div>
          <label className="flex flex-col gap-1 w-full">
            Email
            <input
              name="email"
              type="email"
              className="w-full p-3 rounded-xl border"
              placeholder="email..."
            />
          </label>
          <label className="flex flex-col gap-1 w-full">
            Password
            <input
              name="password"
              type="password"
              className="w-full p-3 rounded-xl border"
              placeholder="password..."
            />
          </label>
          <Button
            type="submit"
            variant={"default"}
            className="w-full bg-[#2828d5] hover:bg-[#0505fb] rounded-xl p-6 mt-6"
          >
            Sign In
          </Button>
        </form>
      ) : (
        <>
          <div className="w-full">
            <Button
              variant="outline"
              onClick={() => {
                setOpenSignInWithCredentials(true);
              }}
              className="w-full rounded-xl p-6 flex justify-center  items-center gap-3"
            >
              <Image
                src={credentials.src}
                alt="credentials logo"
                width={30}
                height={30}
              />
              <p>Sign In With Email/Password</p>
            </Button>
          </div>
          <div className="w-full">
            <Button
              variant="outline"
              onClick={async () => {
                await signIn("google");
              }}
              className="w-full rounded-xl p-6 flex justify-center  items-center gap-3"
            >
              <Image
                src={google.src}
                alt="google logo"
                width={30}
                height={30}
              />
              <p>Sign In With Google</p>
            </Button>
          </div>
          <div className="w-full">
            <Button
              variant="outline"
              onClick={async () => {
                await signIn("github");
              }}
              className="w-full rounded-xl p-6 flex justify-center  items-center gap-3"
            >
              <Image
                src={github.src}
                alt="github logo"
                width={30}
                height={30}
              />
              <p>Sign In With Github</p>
            </Button>
          </div>
          <div className="w-full">
            <Button
              variant="outline"
              onClick={async () => {
                await signIn("facebook");
              }}
              className="w-full rounded-xl p-6 flex justify-center  items-center gap-3"
            >
              <Image
                src={facebook.src}
                alt="facebook logo"
                width={30}
                height={30}
              />
              <p>Sign In With Facebook</p>
            </Button>
          </div>
        </>
      )}
      <p className="flex gap-1 text-sm justify-center w-full mt-4">
        Don&apos;t have an account?{" "}
        <p
          className="text-[#0505fb] cursor-pointer hover:underline"
          onClick={() => setAuthentication(false)}
        >
          Sign Up
        </p>
      </p>
    </div>
  );
}
