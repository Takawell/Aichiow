import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prismadb";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Kita pakai formidable untuk upload file
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err: Error | null, fields: formidable.Fields, files: formidable.Files) => {
    if (err) {
      return res.status(500).json({ error: "Upload error" });
    }

    const avatarFile = (files as any).avatar;
    if (!avatarFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      // Buat folder public/avatars jika belum ada
      const uploadDir = path.join(process.cwd(), "public", "avatars");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Pindahkan file
      const newFileName = `${Date.now()}_${avatarFile.originalFilename}`;
      const newFilePath = path.join(uploadDir, newFileName);
      fs.renameSync(avatarFile.filepath, newFilePath);

      // URL avatar baru
      const avatarUrl = `/avatars/${newFileName}`;

      // Update field avatar di Prisma
      await prisma.user.update({
        where: { email: session.user.email },
        data: { avatar: avatarUrl },
      });

      return res.status(200).json({ message: "Avatar updated", avatarUrl });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  });
}
