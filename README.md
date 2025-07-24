# AI-Rticle Backend

This is the backend for **AI-Rticle**, a full-stack AI-powered content creation and article management platform. It provides REST APIs for post management, user authentication, and AI-based content summarization/TL;DR/Expand powered by DeepSeek.

## 🧠 Features

- User Authentication with JWT (Access & Refresh)
- Post CRUD operations
- AI integration via DeepSeek API for content summarization, TL;DR, and Expand
- Prisma ORM with PostgreSQL
- RESTful API architecture
- Input validation
- Environment-based configuration
- Linting and formatting tools (ESLint + Prettier)
- Deployed-ready on platforms like Vercel or Render

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/rubayetseason/ai-rticle-backend.git ai-rticle-backend
cd ai-rticle-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file and configure the following variables:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=your_postgres_url
DIRECT_URL=your_direct_url (optional if using local postgres)
ALLOWED_ORIGINS=http://localhost:3000,https://ai-rticle-frontend.vercel.app

BCRYPT_SALT_ROUNDS=10

JWT_SECRET=your_access_secret
JWT_EXPIRES_IN=1d

JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=365d

DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=
DEEPSEEK_MODEL=
DEEPSEEK_SITE_NAME=AI-Rticle
DEEPSEEK_SITE_URL=https://ai-rticle-frontend.vercel.app
```

---

### 4. Prisma Setup

Make sure your database is accessible, then:

```bash
npx prisma db push
```

To generate Prisma client:

```bash
npx prisma generate
```

To view DB in browser:

```bash
npx prisma studio
```

---

### 5. Run the Server

```bash
npm run dev
```

---

## 🧪 Available Scripts

- `npm run dev` – Start development server
- `npm run start` – Start production server
- `npm run test` – Run tests
- `npm run lint:check` – Check for lint errors
- `npm run lint:fix` – Auto-fix lint issues
- `npm run prettier:check` – Check code formatting
- `npm run prettier:fix` – Auto-fix formatting

---

## 📁 Tech Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- TypeScript
- JWT
- OpenAI
- DeepSeek AI
- ESLint & Prettier
