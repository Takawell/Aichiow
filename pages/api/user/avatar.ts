import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prismadb";
import { authOptions } from "../auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) return res.status(500).json({ error: "Upload error" });

    const avatarFile = files.avatar?.[0] || files.avatar;
    if (!avatarFile || !avatarFile.filepath) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const avatarUrl = `/uploads/${path.basename(avatarFile.filepath)}`;
      await prisma.user.update({
        where: { email: session.user?.email ?? "" },
        data: { avatar: avatarUrl },
      });

      return res.status(200).json({ message: "Avatar updated", avatarUrl });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  });
}
