import { getCurrentUser } from "@/features/auth/queries";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileClient } from "./ProfileClient";

export default async function LuxuryProfilePage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) redirect("/auth/login?callbackUrl=/account/profile");

  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
  });

  return (
    <ProfileClient
      user={{
        id: sessionUser.id,
        name: dbUser?.name || sessionUser.name || "Valued Atelier Member",
        email: dbUser?.email || sessionUser.email || "",
        image: dbUser?.image || sessionUser.image,
        createdAt: dbUser?.createdAt ? dbUser.createdAt.toISOString() : new Date().toISOString(),
      }}
    />
  );
}

