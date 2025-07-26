// pages/api/user/favorites.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import prisma from '@/lib/prismadb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.email) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const favorites = await prisma.favorite.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { createdAt: 'desc' },
    })
    return res.status(200).json(favorites)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
