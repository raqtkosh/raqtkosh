import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest } from 'next'

interface RedeemRequest {
  items: {
    rewardId: string
    quantity: number
  }[]
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = getAuth(req as unknown as NextApiRequest)
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: RedeemRequest = await req.json()
    const { items } = body


    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided for redemption' },
        { status: 400 }
      )
    }

 
    const result = await db.$transaction(async (prisma) => {
      // Get user with current points
      const user = await prisma.user.findUnique({
        where: { clerkId },
        select: {
          id: true,
          points: true
        }
      })

      if (!user) {
        throw new Error('User not found')
      }

     
      const rewards = await prisma.reward.findMany({
        where: {
          id: {
            in: items.map(item => item.rewardId)
          }
        }
      })

      const totalPoints = items.reduce((sum, item) => {
        const reward = rewards.find(r => r.id === item.rewardId)
        return sum + (reward?.pointsCost || 0) * item.quantity
      }, 0)

     
      if (user.points < totalPoints) {
        throw new Error('Insufficient points')
      }

      
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          points: {
            decrement: totalPoints
          }
        },
        select: {
          points: true
        }
      })

   
      const redeemedRewards = []
      for (const item of items) {
        const reward = rewards.find(r => r.id === item.rewardId)
        if (!reward) continue

        for (let i = 0; i < item.quantity; i++) {
          const userReward = await prisma.userReward.create({
            data: {
              userId: user.id,
              rewardId: reward.id,
              isUsed: false
            },
            include: {
              reward: true
            }
          })
          redeemedRewards.push(userReward)
        }
      }

      return {
        newPoints: updatedUser.points,
        redeemedRewards
      }
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('[REWARD_REDEEM_ERROR]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}