# Aesops Web

Aesops is a Sanity-powered marketing/content site paired with an authenticated dataset platform — upload, browse, and query datasets, with tRPC + Drizzle/Postgres on the backend and a Python scraper suite feeding it on a schedule.

## Features

### Removed Features

The following features have been removed to declutter the codebase:

- **Competitions**: Removed the competition feature, including all components, routes, and Sanity schemas.
- **Data Digest**: Removed the data visualization feature and associated Prisma models.
- **Clerk Authentication**: Removed Clerk as it was only being used for gated features; the platform now uses Better Auth.
- **Mailchimp Integration**: Removed the Mailchimp marketing API configuration.
- **Projects & Project Selector**: Removed the custom project document type and its associated external API selector from Sanity and the frontend.
