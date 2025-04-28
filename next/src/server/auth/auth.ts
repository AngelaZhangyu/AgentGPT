import type { DefaultSession, JWT, NextAuthOptions, Profile, User } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";

import { serverEnv } from "../../env/schema.mjs";

// Azure AD profile 可能包含的額外字段
interface AzureADProfile extends Profile {
  oid?: string;
  sub?: string;
}

// 擴展 JWT 和 Session 類型以包含自定義字段
declare module "next-auth" {
  interface JWT {
    azureAdId?: string;
  }

  interface Session {
    azureAdId?: string;
    user: DefaultSession["user"] & {
      id: string;
      superAdmin?: boolean;
      organizations?: Array<{
        id: string;
        name: string;
        role: string;
      }>;
    };
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: serverEnv.GOOGLE_CLIENT_ID ?? "",
    //   clientSecret: serverEnv.GOOGLE_CLIENT_SECRET ?? "",
    //   allowDangerousEmailAccountLinking: true,
    // }),
    // GithubProvider({
    //   clientId: serverEnv.GITHUB_CLIENT_ID ?? "",
    //   clientSecret: serverEnv.GITHUB_CLIENT_SECRET ?? "",
    //   allowDangerousEmailAccountLinking: true,
    // }),
    // DiscordProvider({
    //   clientId: serverEnv.DISCORD_CLIENT_ID ?? "",
    //   clientSecret: serverEnv.DISCORD_CLIENT_SECRET ?? "",
    //   allowDangerousEmailAccountLinking: true,
    // }),
    AzureADProvider({
      clientId: serverEnv.MICROSOFT_CLIENT_ID ?? "",
      clientSecret: serverEnv.MICROSOFT_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: serverEnv.MICROSOFT_AUTH_SCOPE ?? "openid profile email User.Read"
        }
      },
      allowDangerousEmailAccountLinking: true,
      async profile(profile, tokens) {
        const response = await fetch("https://graph.microsoft.com/v1.0/me", {
          headers: { "Authorization": `Bearer ${tokens.access_token}` }
        });
        const msProfile = await response.json();
        return {
          id: msProfile.id,
          email: msProfile.mail,
          name: msProfile.displayName,
        } as User
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  }
};
