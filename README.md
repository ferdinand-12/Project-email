This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


📁 Struktur Folder Next.js
pingme-nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home (redirect ke login)
│   │   ├── globals.css         # CSS lama + custom
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   ├── signup/
│   │   │   └── page.tsx        # Signup page
│   │   ├── inbox/
│   │   │   └── page.tsx        # Inbox page
│   │   ├── sent/
│   │   │   └── page.tsx        # Sent mail
│   │   ├── drafts/
│   │   │   └── page.tsx        # Drafts
│   │   ├── trash/
│   │   │   └── page.tsx        # Trash
│   │   ├── starred/
│   │   │   └── page.tsx        # Starred
│   │   ├── compose/
│   │   │   └── page.tsx        # Compose email
│   │   ├── email/[id]/
│   │   │   └── page.tsx        # Email detail
│   │   ├── reply/[id]/
│   │   │   └── page.tsx        # Reply email
│   │   ├── profile/
│   │   │   └── page.tsx        # Profile
│   │   ├── contacts/
│   │   │   └── page.tsx        # Contacts
│   │   └── api/                # API Routes (backend)
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   └── signup/route.ts
│   │       └── emails/
│   │           └── route.ts
│   ├── components/
│   │   ├── Sidebar.tsx         # Sidebar component
│   │   ├── EmailList.tsx       # Email list component
│   │   └── EmailItem.tsx       # Single email item
│   ├── lib/
│   │   ├── db.ts               # Database connection (localStorage untuk client)
│   │   └── utils.ts            # Helper functions
│   └── types/
│       └── index.ts            # TypeScript types
├── public/
├── package.json
└── next.config.js