import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) throw new Error("Incorrect password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
callbacks: {
  async jwt({ token, user, account, profile }) {
    await connectDB();

    if (user) {
      // OAuth users
      if (account?.provider === "google") {
        let dbUser = await User.findOne({ email: user.email });
        if (!dbUser) {
          dbUser = await User.create({
            name: user.name || "No Name",
            email: user.email,
            password: "", // No password for OAuth
            address: "",
            phone: "",
            avatar: user.image || "", // <-- store Google avatar URL here if available
            isAdmin: false,
          });
        }
        token._id = dbUser._id.toString();
        token.isAdmin = dbUser.isAdmin;
        token.avatar = dbUser.avatar || "";
      }

      // Credentials provider
      if (account?.provider === "credentials") {
        token._id = user.id; // from authorize()
        token.isAdmin = user.isAdmin || false;

        // Also add avatar from DB
        const dbUser = await User.findById(user.id);
        token.avatar = dbUser?.avatar || "";
      }
    }

    return token;
  },

  async session({ session, token }) {
    if (token?._id) {
      session.user._id = token._id;
    } else {
      console.warn("No token._id found! OAuth session broken.");
    }
    session.user.isAdmin = token.isAdmin;
    session.user.avatar = token.avatar || ""; // <-- add avatar here
    return session;
  },
},


  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
