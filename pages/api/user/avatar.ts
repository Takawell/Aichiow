// pages/api/user/avatar.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { Fields, Files } from 'formidable'
import fs from 'fs'
import path from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import prisma from '@/lib/prismadb'

export const config = {
  api: {
    bodyParser: false, // penting untuk formidable
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
    maxFileSize: 5 * 1024 * 1024, // Maksimal 5MB
  })

  form.keepExtensions = true

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) return res.status(500).json({ error: 'Upload error' })

    const file = files.avatar
    if (!file || Array.isArray(file)) {
      return res.status(400).json({ error: 'Invalid file upload' })
    }

    try {
      const uploadDir = path.join(process.cwd(), 'public/uploads')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      const newFileName = `${Date.now()}-${file.originalFilename}`
      const newPath = path.join(uploadDir, newFileName)

      // Pindahkan file
      fs.renameSync(file.filepath, newPath)

      // Simpan path avatar ke database user
      const avatarUrl = `/uploads/${newFileName}`
      await prisma.user.update({
        where: { email: session.user.email },
        data: { avatar: avatarUrl },
      })

      return res.status(200).json({ message: 'Avatar updated', avatarUrl })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Server error' })
    }
  })
}
