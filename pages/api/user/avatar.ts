// pages/api/user/avatar.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import prisma from '@/lib/prismadb'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const form = formidable({
    multiples: false,
    maxFileSize: 5 * 1024 * 1024, // 5 MB
    keepExtensions: true,
  })

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload error' })

    const avatarFile = (files as any).avatar
    if (!avatarFile) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    try {
      const uploadDir = path.join(process.cwd(), 'public/uploads')
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

      const newFileName = `${Date.now()}-${avatarFile.originalFilename}`
      const newPath = path.join(uploadDir, newFileName)

      fs.renameSync(avatarFile.filepath, newPath)

      const avatarUrl = `/uploads/${newFileName}`
      await prisma.user.update({
        where: { email: session.user.email },
        data: { avatar: avatarUrl },
      })

      return res.status(200).json({ message: 'Avatar updated', avatarUrl })
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: 'Server error' })
    }
  })
}
