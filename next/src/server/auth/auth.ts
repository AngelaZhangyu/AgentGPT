import type { DefaultSession, JWT, NextAuthOptions, Profile } from "next-auth";
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
    GoogleProvider({
      clientId: serverEnv.GOOGLE_CLIENT_ID ?? "",
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: serverEnv.GITHUB_CLIENT_ID ?? "",
      clientSecret: serverEnv.GITHUB_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    DiscordProvider({
      clientId: serverEnv.DISCORD_CLIENT_ID ?? "",
      clientSecret: serverEnv.DISCORD_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    AzureADProvider({
      clientId: serverEnv.MICROSOFT_CLIENT_ID ?? "",
      clientSecret: serverEnv.MICROSOFT_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: serverEnv.MICROSOFT_AUTH_SCOPE ?? "openid profile email User.Read"
        }
      },
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    // Fallback to base url if provided url is not a subdirectory
    redirect: (params: { url: string; baseUrl: string }) =>
      params.url.startsWith(params.baseUrl) ? params.url : params.baseUrl,

    async signIn({ user, account, profile, email, credentials }) {
      console.log("[handler async signIn]", { user, account, email, profileKeys: profile ? Object.keys(profile) : null, credentials })
      if (account?.provider === "azure-ad" && profile) {
        // 可以在這裡添加 Azure AD 登錄成功後的特殊處理邏輯
        if (user) {
          // 確保從 Azure AD 獲取的郵箱和姓名正確設置
          if (profile.email && !user.email) {
            user.email = profile.email as string;
            console.log("[signIn] Setting user email:", user.email);
          }

          if (profile.name && !user.name) {
            user.name = profile.name;
            console.log("[signIn] Setting user name:", user.name);
          }

          // 如果需要，從 Azure AD 獲取的額外信息也可以保存
          // 例如部門、職位等信息
        }
      }
      return true;
    },

    async jwt({ token, account, profile }) {
      console.log("[handler async jwt]", { tokenKeys: Object.keys(token), accountProvider: account?.provider })
      // 將 Azure AD 特定的信息添加到 JWT 令牌中
      if (account?.provider === "azure-ad" && profile) {
        const azureProfile = profile as AzureADProfile;
        token.azureAdId = azureProfile.oid || azureProfile.sub;
        console.log("[jwt] Setting azureAdId:", token.azureAdId);
        // 可以添加其他 Azure AD 相關信息到令牌中
      }
      return token;
    },

    async session({ session, token }) {
      console.log("[handler async session]")
      // 確保會話對象包含 Azure AD 信息
      if (token && token.azureAdId) {
        session.azureAdId = token.azureAdId as string;
      }
      return session;
    }
  }
};
