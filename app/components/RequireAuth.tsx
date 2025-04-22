import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  
  // If the user is not signed in, redirect to the sign-in page
  if (!user) {
    redirect("/sign-in");
  }

  // If the user is signed in, show the children components
  return <>{children}</>;
}