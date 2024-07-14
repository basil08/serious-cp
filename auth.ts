import NextAuth from "next-auth"
import "next-auth/jwt"

import CredentialsProvider from "next-auth/providers/credentials";

// import Apple from "next-auth/providers/apple"
// import AzureB2C from "next-auth/providers/azure-ad-b2c"
// import BoxyHQSAML from "next-auth/providers/boxyhq-saml"
// import Cognito from "next-auth/providers/cognito"
// import Coinbase from "next-auth/providers/coinbase"
// import Discord from "next-auth/providers/discord"
// import Dropbox from "next-auth/providers/dropbox"
// import Facebook from "next-auth/providers/facebook"
import GitHub from "next-auth/providers/github"
// import GitLab from "next-auth/providers/gitlab"
import Google from "next-auth/providers/google"
// import Hubspot from "next-auth/providers/hubspot"
// import Keycloak from "next-auth/providers/keycloak"
// import LinkedIn from "next-auth/providers/linkedin"
// import Netlify from "next-auth/providers/netlify"
// import Okta from "next-auth/providers/okta"
// import Passage from "next-auth/providers/passage"
// import Passkey from "next-auth/providers/passkey"
// import Pinterest from "next-auth/providers/pinterest"
// import Reddit from "next-auth/providers/reddit"
// import Slack from "next-auth/providers/slack"
// import Spotify from "next-auth/providers/spotify"
// import Twitch from "next-auth/providers/twitch"
// import Twitter from "next-auth/providers/twitter"
// import WorkOS from "next-auth/providers/workos"
// import Zoom from "next-auth/providers/zoom"
// import { createStorage } from "unstorage"
// import memoryDriver from "unstorage/drivers/memory"
// import vercelKVDriver from "unstorage/drivers/vercel-kv"
// import { UnstorageAdapter } from "@auth/unstorage-adapter"
import type { NextAuthConfig } from "next-auth"
// import { FirestoreAdapter } from "@auth/firebase-adapter";
// import { firestore } from "./lib/firestore";
// const storage = createStorage({
//   driver: process.env.VERCEL
//     ? vercelKVDriver({
//       url: process.env.AUTH_KV_REST_API_URL,
//       token: process.env.AUTH_KV_REST_API_TOKEN,
//       env: false,
//     })
//     : memoryDriver(),
// })

import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaNeon } from "@prisma/adapter-neon"
import { Pool } from "@neondatabase/serverless"

const neon = new Pool({
  connectionString: process.env.AUTH_POSTGRES_PRISMA_URL,
})
const adapter = new PrismaNeon(neon)
const prisma = new PrismaClient({ adapter })

const config = {
  theme: { logo: "/logo.png" },
  // adapter: FirestoreAdapter(),
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub,
    Google,
    // EmailProvider(
    //   {
    //     server: {
    //       host: process.env.EMAIL_SERVER_HOST,
    //       port: process.env.EMAIL_SERVER_PORT,
    //       auth: {
    //         user: process.env.EMAIL_SERVER_USER,
    //         password: process.env.EMAIL_SERVER_PASSWORD
    //       },
    //     },
    //     from: process.env.EMAIL_FROM
    //   }
    // ),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "johndoe@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {

        console.log(credentials);

        // spoof user 
        const user = { email: "basil@labib.com", id: 1 };

        if (user) {
          return { id: user.id, email: user.email };
        } else {
          return null;
        }
      }
    })
  ],
  basePath: "/auth",
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    jwt({ token, trigger, session, account }) {
      if (trigger === "update") token.name = session.user.name
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token }
      }
      return token
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken
      }
      return session
    },
  },
  debug: process.env.NODE_ENV !== "production" ? true : false,
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}
