# CV app

## Local Setup

### Requirements

- node.js
- npm, yarn, or pnpm

### Local Setup Steps:

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

   Note: Variables accessible on the client must start with the `NEXT_PUBLIC_` prefix

4. **Start the development server:**
   ```bash
   pnpm dev
   ```
   Once built, the application will be available in your browser at `http://localhost:3000/`.
