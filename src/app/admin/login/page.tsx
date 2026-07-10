import LoginForm from "./LoginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-earth-900">Admin Login</h1>
          <p className="mt-2 text-earth-600">Sign in to manage Damar Glamping</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
