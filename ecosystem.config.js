module.exports = {
    apps: [
      {
        name: 'species-web',
        script: 'npm',
        args: 'run start',
        env: {
          NODE_ENV: 'production',
          DATABASE_URL: process.env.DATABASE_URL,
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
          AUTH0_ID: process.env.AUTH0_ID,
          AUTH0_SECRET: process.env.AUTH0_SECRET,
          AUTH0_ISSUER: process.env.AUTH0_ISSUER,
          NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
          API_SECRET: process.env.API_SECRET,
        },
      },
    ],
  };