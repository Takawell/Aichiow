// pages/api/user/avatar.ts
import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import formidable from 'formidable'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import prisma from '@/lib/prismadb'

export const config = {
  api: {
    bodyParser: false, // kita pakai formidable
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.email) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const form = new formidable.IncomingForm()
  form.uploadDir = path.join(process.cwd(), '/public/uploads')
  form.keepExtensions = true

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload error' })

    const file = files.avatar
    if (!file || Array.isArray(file)) return res.status(400).json({ error: 'Invalid file' })

    const filename = path.basename(file.filepath)
    const avatarUrl = `/uploads/${filename}`

    // Update user avatar di DB
    await prisma.user.update({
      where: { email: session.user.email },
      data: { avatar: avatarUrl },
    })

    return res.status(200).json({ avatar: avatarUrl })
  })
}
