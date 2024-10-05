/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import google from "@/app/assets/google.png";
import facebook from "@/app/assets/facebook.png";
import github from "@/app/assets/github.png";
import credentials from "@/app/assets/password.png";
import leftArrow from "@/app/assets/back.png";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import env from "@/env";
import ExpiryTimestamp from "./ExpiryTimestamp";

const SignUp = ({ setAuthentication }: any) => {
  const { toast } = useToast();
  const [openSignUpWithCredentials, setOpenSignUpWithCredentials] =
    useState<boolean>(false);
  const [verifyAccount, setVerifyAccount] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch(`${env.app.server_url}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (data.meta.statusCode !== 201) {
        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
          ),
          variant: "destructive",
          description: data.meta.message,
          duration: 2000,
        });
        return;
      }
      setVerifyAccount(true);
      setEmail(data.data.email);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyCodeSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(`${env.app.server_url}/api/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, verificationCode }),
      });
      const data = await response.json();
      if (data.meta.statusCode !== 200) {
        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
          ),
          variant: "destructive",
          description: data.meta.message,
          duration: 2000,
        });
        return;
      }
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "default",
        description: "Verify success!",
        duration: 2000,
      });
      setAuthentication(true);
      setVerifyAccount(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center px-6 gap-6 mb-6">
      {openSignUpWithCredentials ? (
        !verifyAccount ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-2 w-full"
          >
            <div className="w-full flex justify-start gap-2 mb-4">
              <div
                onClick={() => setOpenSignUpWithCredentials(false)}
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
              Username
              <input
                name="username"
                type="text"
                className="w-full p-3 rounded-xl border"
                placeholder="username..."
              />
            </label>
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
              Sign Up
            </Button>
          </form>
        ) : (
          <>
            <ExpiryTimestamp />
            <InputOTP
              maxLength={6}
              onChange={(e) => setVerificationCode(e)}
              className="text-lg"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="py-6 px-7" />
                <InputOTPSlot index={1} className="py-6 px-7" />
                <InputOTPSlot index={2} className="py-6 px-7" />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} className="py-6 px-7" />
                <InputOTPSlot index={4} className="py-6 px-7" />
                <InputOTPSlot index={5} className="py-6 px-7" />
              </InputOTPGroup>
            </InputOTP>
            <Button
              variant={"default"}
              className="w-full bg-[#2828d5] hover:bg-[#0505fb] rounded-xl p-6 mt-6"
              onClick={handleVerifyCodeSubmit}
            >
              Verify
            </Button>
          </>
        )
      ) : (
        <>
          <div className="w-full">
            <Button
              variant="outline"
              onClick={() => {
                setOpenSignUpWithCredentials(true);
              }}
              className="w-full rounded-xl p-6 flex justify-center  items-center gap-3"
            >
              <Image
                src={credentials.src}
                alt="credentials logo"
                width={30}
                height={30}
              />
              <p>Sign Up With Email/Password</p>
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
              <p>Sign Up With Google</p>
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
              <p>Sign Up With Github</p>
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
              <p>Sign Up With Facebook</p>
            </Button>
          </div>
        </>
      )}
      <p className="flex gap-1 text-sm justify-center w-full mt-4">
        Already have an account?
        <p
          className="text-[#0505fb] cursor-pointer hover:underline"
          onClick={() => setAuthentication(true)}
        >
          Sign In
        </p>
      </p>
    </div>
  );
};

export default SignUp;
