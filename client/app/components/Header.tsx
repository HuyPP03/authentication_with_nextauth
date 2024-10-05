"use client";

import { useSession } from "next-auth/react";
import { SignIn } from "./SignIn";
import SignOut from "./SignOut";
import SignUp from "./SignUp";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Header = () => {
  const { data: session } = useSession();
  const [authentication, setAuthentication] = useState<boolean>(true);
  return (
    <div className="flex h-16 gap-10 justify-between px-8 border-b-2">
      <div></div>
      <div className="flex gap-2 items-center justify-center">
        {!session ? (
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex gap-4">
                <Button
                  variant="default"
                  className="rounded-full px-8"
                  onClick={() => setAuthentication(true)}
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  className="rounded-full px-8 bg-[#ff5117] hover:bg-[#ff480b]"
                  onClick={() => setAuthentication(false)}
                >
                  Sign Up
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] py-12">
              <DialogHeader>
                <DialogTitle className="flex justify-center text-4xl mb-4">
                  {authentication ? "Sign In" : "Sign Up"}
                </DialogTitle>
                <DialogDescription className="flex justify-center pb-4">
                  {authentication ? "Sign In " : "Sign Up "} with us.
                </DialogDescription>
              </DialogHeader>
              {authentication ? (
                <SignIn setAuthentication={setAuthentication} />
              ) : (
                <SignUp setAuthentication={setAuthentication} />
              )}
            </DialogContent>
          </Dialog>
        ) : (
          <>
            <h1>Welcome, {session.user?.name}!</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={
                      session.user?.image ||
                      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                    }
                  />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 px-6 py-6 min-h-20 mr-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-xl font-semibold">
                      {session.user?.name}
                    </div>
                    <div className="text-sm font-light">
                      {session.user?.email}
                    </div>
                  </div>
                  <div>
                    <Avatar>
                      <AvatarImage
                        src={
                          session.user?.image ||
                          "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                        }
                      />
                    </Avatar>
                  </div>
                </div>
                <div className="border" />
                <SignOut />
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
