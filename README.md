# CV App

A modern CV and user management application built with Next.js, React, and GraphQL. The platform enables users to manage profiles, skills, languages, and CVs, with support for PDF export, authentication workflows, and application personalization.

## Features

- User authentication
- User profile management with avatar upload
- CV creation and management
- Search and sorting for users and CVs
- CV preview and PDF export
- Internationalization (i18n) support
- Theme and appearance settings
- Administration management

## Running the Application

### Prerequisites

- Node.js
- pnpm

### Installation

1. **Clone the repository:**

   ```bash
   git clone git@github.com:omwi/cv-krasouski-kuhel.git
   cd cv-krasouski-kuhel
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Create a `.env` file in the root of the project:**

   ```bash
   cp .env.example .env
   ```

   > Client-side environment variables must use the `NEXT_PUBLIC_` prefix.

4. **Start the development server:**

   ```bash
   pnpm dev
   ```

   Once built, the application will be available in your browser at `http://localhost:3000/`.

## Main Dependencies

- Next.js 16
- React 19
- TypeScript
- Apollo Client
- GraphQL
- React Hook Form
- Zod
- Tailwind CSS
- Radix UI
- i18next
