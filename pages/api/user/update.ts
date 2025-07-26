import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files } from "formidable";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

// Konfigurasi untuk parsing form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "public", "uploads");

// Pastikan folder upload ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = formidable({ multiples: false });
  form.keepExtensions = true;

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) return res.status(500).json({ error: "Upload error" });

    try {
      const name = fields.name ? String(fields.name) : session.user.name;
      let avatarPath = session.user.image || "/avatar.png";

      if (files.avatar) {
        const avatarFile = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar;
        const ext = path.extname(avatarFile.originalFilename || ".png");
        const newFilename = `${session.user.email}-${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, newFilename);

        fs.renameSync(avatarFile.filepath, filePath);
        avatarPath = `/uploads/${newFilename}`;
      }

      // Update user di database
      const updatedUser = await prisma.user.update({
        where: { email: session.user.email! },
        data: {
          name,
          image: avatarPath,
        },
      });

      return res.status(200).json({ user: updatedUser });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Something went wrong" });
    }
  });
}
