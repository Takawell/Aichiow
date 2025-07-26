import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import prisma from '@/lib/prismadb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) return res.status(404).json({ message: 'User not found' })

  if (req.method === 'GET') {
    // Ambil semua bookmark user
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })
    return res.status(200).json(bookmarks)
  }

  if (req.method === 'POST') {
    const { itemId, itemType, title, image } = req.body
    try {
      const newBookmark = await prisma.bookmark.create({
        data: {
          userId: user.id,
          itemId,
          itemType,
          title,
          image,
        },
      })
      return res.status(201).json(newBookmark)
    } catch (error) {
      return res.status(400).json({ message: 'Failed to add bookmark', error })
    }
  }

  if (req.method === 'DELETE') {
    const { itemId, itemType } = req.body
    try {
      await prisma.bookmark.delete({
        where: {
          userId_itemId_itemType: {
            userId: user.id,
            itemId,
            itemType,
          },
        },
      })
      return res.status(200).json({ message: 'Bookmark removed' })
    } catch (error) {
      return res.status(400).json({ message: 'Failed to remove bookmark', error })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
