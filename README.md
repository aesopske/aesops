# Aesops Web

Website for Aesops.

## Features

### Removed Features

The following features have been removed to declutter the codebase:

- **Competitions**
- **Data Digest**
- **Prisma & Database Access**: Removed the database layer and all associated models to maintain a pure CMS-driven frontend for now.
- **tRPC**: Removed the tRPC bridge as it was primarily used for database interactions.
- **Clerk Authentication**: Removed Clerk as it was only being used for the competition feature.
