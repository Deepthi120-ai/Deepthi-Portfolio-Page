# Portfolio Page 3

This is a small Express app that serves a premium portfolio dashboard and sends project inquiries to Strapi when configured.

## Prerequisites

- Node.js installed locally
- npm installed locally
- A Strapi collection type for inquiries, if you want form submissions to persist

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Or start it without watch mode:

```bash
npm start
```

The server listens on port `5500`:

```text
http://localhost:5500
```

## Routes

- `/` loads `Projects.html`
- `/Projects` loads `Projects.html`
- `/Profile` redirects to the approach section
- `/Contact` redirects to the inquiry section
- `POST /addMessage` sends the inquiry form data to Strapi

## Strapi Setup

Create a Strapi collection type such as `inquiry` or `inquiries` with these fields:

- `fullName` text
- `lastName` text
- `email` email or text
- `projectCategory` text
- `message` rich text or long text

Then configure these environment variables before starting the app:

```powershell
$env:STRAPI_URL="http://localhost:1337"
$env:STRAPI_TOKEN="your-strapi-api-token"
$env:STRAPI_INQUIRY_ENDPOINT="/api/inquiries"
npm start
```

`STRAPI_TOKEN` is optional only if your Strapi create permission is public. Keeping it private through an API token is safer.

## Optional CMS Content

The frontend includes `public/cms-config.js` for future Strapi-powered page content:

```js
window.PORTFOLIO_CMS = {
    baseUrl: 'http://localhost:1337',
    portfolioEndpoint: '/api/portfolio-page?populate=deep'
};
```

If `baseUrl` is blank, the dashboard uses the local fallback content.

## Optional MongoDB Fallback

If `STRAPI_URL` is not set, the server can still save inquiries to MongoDB when `MONGODB_URI` is configured:

```powershell
$env:MONGODB_URI="mongodb+srv://username:password@example.mongodb.net/Contacts"
```

Do not commit real database credentials or API tokens to this repository.
