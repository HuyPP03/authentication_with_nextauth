/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";

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
        const user = { id: "1", name: "J Smith", email: credentials.email };
        if (user) {
          return user;
        } else {
          return null;
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
    async signIn({ user, account }: any): Promise<any> {
      if (account?.provider === "credentials") {
        return true;
      }
      if (account?.provider === "google") {
        try {
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }
      if (account?.provider === "facebook") {
        try {
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }
      if (account?.provider === "github") {
        try {
          return true;
        } catch (error) {
          console.log(error);
          return false;
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
