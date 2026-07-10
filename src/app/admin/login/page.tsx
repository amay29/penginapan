import LoginForm from "./LoginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian-900 px-4">
      <div className="w-full max-w-md">
        {/* Brand mark */}
        <div className="mb-12 text-center">
          <p className="font-serif text-4xl tracking-[0.2em] text-parchment-100">DAMAR</p>
          <p className="mt-3 text-[9px] uppercase tracking-[0.3em] text-obsidian-500">
            Staff Portal
          </p>
        </div>

        <div className="border border-obsidian-800 bg-obsidian-950 p-10">
          <h1 className="mb-8 text-[10px] uppercase tracking-[0.25em] text-obsidian-400">
            Sign In to Continue
          </h1>
          <LoginForm />
        </div>

        <p className="mt-8 text-center text-[9px] uppercase tracking-[0.2em] text-obsidian-700">
          Restricted access · Damar Retreats
        </p>
      </div>
    </div>
  );
}
