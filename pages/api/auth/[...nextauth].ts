import NextAuth, { NextAuthOptions } from "next-auth"
import { OAuthConfig } from "next-auth/providers"

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "keycloak",
      name: "Keycloak",
      type: "oauth",
      wellKnown: "https://integration.bhsi.xyz/realms/dassco/.well-known/openid-configuration",
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      profile(profile) {
        // Map Keycloak profile to NextAuth user object
        return {
          id: profile.sub,
          name: profile.preferred_username || profile.name,
          email: profile.email,
          image: profile.picture,
        }
      }
    } as OAuthConfig<any>, // cast ensures TypeScript is happy
  ],

  pages: {
    signIn: "/auth/signin"
  },

}

export default NextAuth(authOptions)

/*import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import Auth0Provider from "next-auth/providers/auth0"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      issuer: process.env.AUTH0_ISSUER,
    })
  ],
  pages: {
    signIn: "/auth/signin"
  }
}

export default NextAuth(authOptions)
*/