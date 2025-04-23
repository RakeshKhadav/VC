Perfect! Since you're using the App Router in Next.js 13+ with Clerk, here’s how to handle the scenario where:

✅ Unauthenticated users can only access the Home Page (/)
❌ If not signed in, all other routes should redirect to /sign-up
✅ Home page buttons redirect to sign-up if not logged in
✅ Authenticated users can access all pages freely

✅ Step-by-Step for App Router + Clerk Auth
1. Set Up Middleware
Create a middleware.ts file in the root:

ts
Copy
Edit
// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/"], // Only home is public
  ignoredRoutes: ["/api/webhook(.*)"], // (Optional) Add API routes you want to skip
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // Protect all routes except static files
};
2. Ensure Clerk Provider is in layout.tsx
In app/layout.tsx (or wherever your root layout is):

tsx
Copy
Edit
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VC Review Platform",
  description: "Transparency for Founders",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
3. Protect Server Components (Like Dashboard)
For any protected page, use Clerk’s auth() in the server component:

tsx
Copy
Edit
// app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-up");
  }

  return <div>Welcome to your dashboard!</div>;
}
4. Redirect Buttons in Home Page
Client-side logic using useUser:

tsx
Copy
Edit
// app/page.tsx (Home Page)
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleClick = () => {
    if (!isSignedIn) {
      router.push("/sign-up");
    } else {
      router.push("/dashboard"); // Or any internal route
    }
  };

  return (
    <div>
      <h1>Welcome to VC Review</h1>
      <button onClick={handleClick}>Start Reviewing</button>
    </div>
  );
}
✅ Summary

Feature	Implementation
Allow unauthenticated access to /	publicRoutes: ["/"] in middleware.ts
Restrict all other pages	Middleware + auth() check on pages
Home button redirects to /sign-up	useUser() client-side logic
Authenticated users access all pages	Automatically handled by Clerk