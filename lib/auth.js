import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

// Configuration options for NextAuth
const authOptions = {
  providers: [
    {
      id: "google",
      name: "Google",
    },
  ],
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
};

/**
 * Get the user's session on the server side
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Check if the user is authenticated on the server side
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

/**
 * Get the current user from the session on the server side
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}
