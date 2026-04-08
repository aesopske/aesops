# Aesops Web

Website for Aesops.

## Features

### Removed Features

The following features have been removed to declutter the codebase:

- **Competitions**: Removed the competition feature, including all components, routes, and Sanity schemas.
- **Data Digest**: Removed the data visualization feature and associated Prisma models.
- **Prisma & Database Access**: Removed the database layer to maintain a pure CMS-driven frontend.
- **tRPC**: Removed the tRPC bridge as it was primarily used for database interactions.
- **Clerk Authentication**: Removed Clerk as it was only being used for gated features.
- **Resend & Newsletter Subscription**: Removed the email collection and newsletter signup forms.
- **Mailchimp Integration**: Removed the Mailchimp marketing API configuration.
- **Projects & Project Selector**: Removed the custom project document type and its associated external API selector from Sanity and the frontend.
