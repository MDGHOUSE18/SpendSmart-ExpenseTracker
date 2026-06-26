# SpendSmart – Personal Expense Tracker

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://expense-tracker-app-ydzc.bolt.host/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

A modern, full-stack personal finance web app to track expenses, set category budgets, and visualize spending habits. Built with React, TypeScript, and Supabase — with INR support and per-user data isolation via Row Level Security.

**Live demo:** [expense-tracker-app-ydzc.bolt.host](https://expense-tracker-app-ydzc.bolt.host/)

## Features

### Authentication
- Email/password sign-up and sign-in
- Email verification before access
- Google OAuth
- Forgot password flow
- Protected dashboard routes

### Expense management
- Add, edit, and delete expenses
- Categorize by expense or income type
- Date, description, and notes on each entry
- Custom categories with icons and colors
- Default categories seeded on first login

### Budget control
- Set monthly or yearly limits per category
- Real-time spend vs. budget tracking
- Visual progress bars and over-budget alerts

### Analytics & reports
- Dashboard with pie and area charts
- Weekly and monthly views
- Reports for 3 months, 6 months, or the current year
- Monthly trend line charts and category breakdowns
- Export expenses to CSV

### UI & experience
- Responsive layout for desktop, tablet, and mobile
- Dark and light mode
- INR (₹) currency formatting for Indian users
- Landing page with product overview

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Dates | date-fns |
| Backend | Supabase (Auth + PostgreSQL) |
| Security | Row Level Security (RLS) |
| Deployment | [Bolt.host](https://bolt.host/) |

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+
- A [Supabase](https://supabase.com/) project

### 1. Clone the repository

```bash
git clone https://github.com/MDGHOUSE18/SpendSmart-ExpenseTracker.git
cd SpendSmart-ExpenseTracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Find these values in your Supabase project under **Settings → API**.

### 4. Set up the database

Run the migration in `supabase/migrations/20260617100041_001_initial_schema.sql` against your Supabase database. You can paste it into the Supabase SQL Editor or apply it with the Supabase CLI.

The migration creates:
- `profiles` – user profile data
- `categories` – expense and income categories
- `expenses` – transaction records
- `budgets` – category budget limits
- `savings_goals` – savings targets (schema ready)
- `recurring_expenses` – recurring bills (schema ready)

All tables use Row Level Security so users can only access their own data.

### 5. Configure Supabase Auth (optional)

For Google sign-in and email flows to work in production:

1. **Authentication → URL configuration** – add your site URL and redirect URLs (`/auth/callback`, `/verify-email`).
2. **Authentication → Providers** – enable Google OAuth if needed.
3. **Authentication → Email** – configure SMTP or use Supabase defaults for verification emails.

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

Production output is written to the `dist/` directory.

## Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |

## Project structure

```
SpendSmart-ExpenseTracker/
├── src/
│   ├── components/
│   │   ├── auth/           # Login, signup, OAuth callback, protected routes
│   │   ├── budgets/        # Budget management
│   │   ├── categories/     # Category CRUD
│   │   ├── dashboard/      # Overview charts and stats
│   │   ├── expenses/       # Expense CRUD
│   │   ├── landing/        # Public landing page
│   │   ├── layout/         # App shell, sidebar, theme toggle
│   │   ├── reports/        # Analytics and CSV export
│   │   └── settings/       # Profile and account settings
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── CategoriesContext.tsx
│   ├── lib/
│   │   └── supabase.ts     # Supabase client and types
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   └── migrations/         # Database schema and RLS policies
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Sign in |
| `/signup` | Public | Create account |
| `/verify-email` | Public | Email confirmation |
| `/forgot-password` | Public | Password reset |
| `/auth/callback` | Public | OAuth redirect handler |
| `/dashboard` | Protected | Overview and charts |
| `/dashboard/expenses` | Protected | Manage expenses |
| `/dashboard/budgets` | Protected | Manage budgets |
| `/dashboard/reports` | Protected | Reports and CSV export |
| `/dashboard/categories` | Protected | Manage categories |
| `/dashboard/settings` | Protected | Profile settings |

## Database schema

Each authenticated user gets isolated data through Supabase RLS policies keyed on `auth.uid()`. New users automatically receive a profile row (via database trigger) and default expense/income categories on first dashboard load.

Default categories are defined in `src/lib/supabase.ts` under `DEFAULT_CATEGORIES`.

## Browser support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## Author

**MD Ghouse**

- GitHub: [@MDGHOUSE18](https://github.com/MDGHOUSE18)
- Portfolio: [CodeByGhouse](https://ghouse-dev.netlify.app/)

## Support

For questions or issues, open a [GitHub issue](https://github.com/MDGHOUSE18/SpendSmart-ExpenseTracker/issues) or email mdghouse23102@gmail.com.

---

Made with care by MD Ghouse
