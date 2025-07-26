import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prismadb";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, formidable handles it
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({});
  const uploadDir = path.join(process.cwd(), "public/uploads/avatars");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  form.uploadDir = uploadDir;
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload error" });

    try {
      const name = fields.name ? String(fields.name) : undefined;
      let avatarUrl: string | undefined = undefined;

      if (files.avatar) {
        const avatarFile = Array.isArray(files.avatar) ? files.avatar[0] : (files.avatar as File);
        const ext = path.extname(avatarFile.originalFilename || "");
        const newFilename = `${session.user.email}-${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, newFilename);
        fs.renameSync(avatarFile.filepath, filePath);
        avatarUrl = `/uploads/avatars/${newFilename}`;
      }

      const updated = await prisma.user.update({
        where: { email: session.user.email },
        data: {
          ...(name && { name }),
          ...(avatarUrl && { avatar: avatarUrl }),
        },
      });

      return res.json({ message: "Profile updated", user: updated });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}
