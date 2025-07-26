import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prismadb";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      return res.status(500).json({ error: "Upload error" });
    }

    const avatarFile = files.avatar as File;
    if (!avatarFile) {
      return res.status(400).json({ error: "No avatar file uploaded" });
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const newFilename = `${session.user.email}-${Date.now()}${path.extname(avatarFile.originalFilename || "")}`;
    const filePath = path.join(uploadDir, newFilename);

    fs.renameSync(avatarFile.filepath, filePath);

    const avatarUrl = `/uploads/${newFilename}`;
    await prisma.user.update({
      where: { email: session.user.email },
      data: { avatar: avatarUrl },
    });

    return res.status(200).json({ message: "Avatar updated", avatarUrl });
  });
}
