# Species-Web

This full-stack web app is used together with [Species-OCR](https://github.com/NHMDenmark/Species-OCR) for storing the text read from specimen cover labels. The app uses a database to store the text and any match from GBIF that may have been found, along with a history of corrections to the text read. For each cover an image in both color and black/white of the label is stored on disk for easy display in the app.

![screenshot](./docs/screenshot.png)

## Getting started

### 1. Setup Authentication

The app uses authentication provided with [Auth0](https://auth0.com/docs). Setup an Auth0 application and save the Domain, Client ID and Client Secret.

### 2. Configure environment

Copy the .env.local.example file in this directory to .env.local (which will be ignored by Git):

```
cp .env.local.example .env.local
```

Input the values saved in step 1.

Generate values for the secrets. The API_SECRET is the token used by [Species-OCR](https://github.com/NHMDenmark/Species-OCR) for authorizing with the app when uploading data.

### 3. Start the application

To run the app use:

```
docker compose up
```

For development you need to run a database and export the DATABASE_URL environment variable. Then use:

```

# deploying on ucloud
 start a new terminal in ubuntu - ucloud
sudo apt update

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc

nvm install 18.20
nvm use 18.20

npm i
npx prisma migrate deploy
npm run dev
```
for prod - run this before pm2
```
npx prisma migrate deploy
npm run build
npm run start
```
## Notes

Authentication is implemented using [AuthJS](https://authjs.dev/), so the provider can easily be substituted for any other supported provider.

**Production**: Depending on the web server used, you may need to allow larger request sizes for the image uploads. For NginX this is done by setting 'client_max_body_size'

### 4. Start the application with PM2

To run the app using PM2:

1. Install PM2 globally:

```
npm install -g pm2
```

2. Create a PM2 configuration file (`ecosystem.config.js`) in the root of your project:

```javascript
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
```

3. Start the application using PM2:

```
pm2 start ecosystem.config.js
```

4. To save the PM2 process list and have it resurrect on reboot:

```
pm2 save
pm2 startup
```

5. To check logs 
```
pm2 logs
```