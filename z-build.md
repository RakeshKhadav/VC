❌ The Error
ts
Type '{ searchParams?: { query?: string | undefined; page?: string | undefined; } | undefined; }' does not satisfy the constraint 'PageProps'.
You're likely using the App Router (app/ directory) and passing searchParams to a page component, but the type you’ve provided doesn’t match what Next.js expects.

🧠 The Cause
In Next.js App Router (with app/ folder), a page like this:

tsx
// app/reviews/page.tsx
export default function Page({ searchParams }: { searchParams?: { query?: string; page?: string } }) {
  return <div>Reviews Page</div>;
}
will fail if your PageProps type expects searchParams to be something like a Promise<any>. The error message is saying:

“I expected searchParams to be Promise<any>, but you gave me { query?: string, page?: string }.”

Which usually happens because your PageProps interface is misdefined or imported incorrectly.

✅ How to Fix
Option 1: Fix the PageProps type inline
Replace:

tsx
export default function Page({ searchParams }: PageProps) {
With:

tsx
export default function Page({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
Option 2: Properly define and use PageProps type
If you're using a custom type, define it like this:

ts
type PageProps = {
  searchParams?: {
    query?: string;
    page?: string;
  };
};
Then use it:

tsx
export default function Page({ searchParams }: PageProps) {
✅ This tells Next.js exactly what searchParams is — no confusion with Promise or other mismatched types.

✅ Bonus: Use Next.js Built-in Types (Optional)
You can also use their helper type for cleaner typing:

ts
import { Metadata } from "next";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};