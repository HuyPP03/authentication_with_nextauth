/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import env from "@/env";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        const { email, password } = credentials;
        const response = await fetch(`${env.app.server_url}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.meta.statusCode !== 200) {
          throw new Error(data.meta.message);
        }
        const user = data.data;
        if (user) {
          if (user.verified) {
            return user;
          } else {
            throw new Error("User not verified!");
          }
        } else {
          throw new Error("Invalid credentials!");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any): Promise<any> {
      const { email, id, image, name } = user;
      if (account?.provider === "credentials") {
        return true;
      } else {
        const response = await fetch(`${env.app.server_url}/api/auth/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        });
        const data: any = await response.json();
        const user = data.data;
        if (user) {
          if (user.provider !== account?.provider) return false;
          return true;
        } else {
          const response = await fetch(
            `${env.app.server_url}/api/auth/create-user-with-provider`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
                provider: account?.provider,
                providerId: id,
                avatar: image,
                username: name,
              }),
            }
          );
          const data = await response.json();
          if (data.meta.statusCode !== 200) {
            throw new Error(data.meta.message);
          }
          return true;
        }
      }
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.name = user.username || user.name;
        token.image = user.image || user.avatar;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.image = token.image;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
