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
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })
    return res.status(200).json(favorites)
  }

  if (req.method === 'POST') {
    const { itemId, itemType, title, image } = req.body
    try {
      const newFavorite = await prisma.favorite.create({
        data: {
          userId: user.id,
          itemId,
          itemType,
          title,
          image,
        },
      })
      return res.status(201).json(newFavorite)
    } catch (error) {
      return res.status(400).json({ message: 'Failed to add favorite', error })
    }
  }

  if (req.method === 'DELETE') {
    const { itemId, itemType } = req.body
    try {
      await prisma.favorite.delete({
        where: {
          userId_itemId_itemType: {
            userId: user.id,
            itemId,
            itemType,
          },
        },
      })
      return res.status(200).json({ message: 'Favorite removed' })
    } catch (error) {
      return res.status(400).json({ message: 'Failed to remove favorite', error })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
