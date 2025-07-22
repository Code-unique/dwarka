import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      isAdmin: boolean;
      _id: string;
    };
  }

  interface User {
    isAdmin: boolean;
    _id: string;
  }

  interface JWT {
    isAdmin: boolean;
    _id: string;
  }
}
