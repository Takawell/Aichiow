import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prismadb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  if (req.method === "GET") {
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(favorites);
  }

  if (req.method === "POST") {
    const { itemId, itemType, title, image } = req.body;
    if (!itemId || !itemType) {
      return res.status(400).json({ error: "itemId & itemType required" });
    }

    const favorite = await prisma.favorite.upsert({
      where: { userId_itemId_itemType: { userId: user.id, itemId, itemType } },
      update: {},
      create: { userId: user.id, itemId, itemType, title, image },
    });

    return res.status(200).json(favorite);
  }

  if (req.method === "DELETE") {
    const { itemId, itemType } = req.body;
    await prisma.favorite.deleteMany({
      where: { userId: user.id, itemId, itemType },
    });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
