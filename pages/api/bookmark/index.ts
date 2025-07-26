import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.method === "GET") {
    // Ambil semua bookmark user
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(bookmarks);
  }

  if (req.method === "POST") {
    const { itemId, itemType, title, image } = req.body;

    if (!itemId || !itemType || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const bookmark = await prisma.bookmark.upsert({
        where: {
          userId_itemId_itemType: {
            userId: user.id,
            itemId,
            itemType,
          },
        },
        update: {},
        create: {
          userId: user.id,
          itemId,
          itemType,
          title,
          image,
        },
      });
      return res.status(201).json(bookmark);
    } catch (error) {
      return res.status(500).json({ message: "Failed to add bookmark", error });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
