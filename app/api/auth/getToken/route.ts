import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { userId, getToken } = getAuth(req);
  
  if (!userId || !getToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Get session token from Clerk
    const token = await getToken();
    
    // Return token as plain text
    return new Response(token);
  } catch (error) {
    console.error("Error getting auth token:", error);
    return new Response("Error retrieving authentication token", { status: 500 });
  }
}