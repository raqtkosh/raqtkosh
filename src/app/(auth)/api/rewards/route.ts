import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest } from 'next'
import { minPointSizeCallback } from 'recharts/types/util/BarUtils'

export async function GET(req: Request) {
  try {
    const { userId: clerkId } = getAuth(req as unknown as NextApiRequest)
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId },
      select: {
        points: true,
        rewards: {
          include: {
            reward: true
          },
          orderBy: {
            redeemedAt: 'desc'
          }
        }
      }
    })
    console.log ('[USER_REWARDS_GET]', user)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      points: user.points,
      rewards: user.rewards
    })
    console.log(user?.points, user?.rewards);

  } catch (error) {
    console.error('[USER_REWARDS_GET_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}