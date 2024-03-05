import { withAuth } from 'next-auth/middleware'

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (
        req.nextUrl.pathname == '/api/folderupload' ||
        req.nextUrl.pathname == '/api/labelupload'
      ) {
        return req.headers.get('Authorization') == process.env.API_SECRET
      } else if (req.nextUrl.pathname == '/herbarium.jpeg') {
        return true
      }
      return !!token
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
})

export const config = { matcher: ['/(.+)', '/'] }
