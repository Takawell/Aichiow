// pages/api/bookmark/index.ts
import { NextApiRequest, NextApiResponse } from 'next'
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

  if (req.method === 'POST') {
    const { itemId, itemType, title, image } = req.body
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
      })
      return res.status(200).json(bookmark)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Failed to save bookmark' })
    }
  }

  if (req.method === 'GET') {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
    })
    return res.status(200).json(bookmarks)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
