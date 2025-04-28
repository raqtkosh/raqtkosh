import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest } from 'next'

export async function GET(req: Request) {
  try {
    const { userId: clerkId } = getAuth(req as unknown as NextApiRequest)
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId },
      include: {
        referrals: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    return NextResponse.json(user?.referrals || [])

  } catch (error) {
    console.error('[REFERRALS_GET_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

interface ReferralPostBody {
  name: string
  phoneNumber: string
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = getAuth(req as unknown as NextApiRequest)
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: ReferralPostBody = await req.json()
    const { name, phoneNumber } = body

    const user = await db.user.findUnique({
      where: { clerkId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format (must be 10 digits)' },
        { status: 400 }
      )
    }

    const existingReferral = await db.referral.findFirst({
      where: {
        referrerId: user.id,
        phoneNumber
      }
    })

    if (existingReferral) {
      return NextResponse.json(
        { 
          error: 'You have already referred this number',
          existingReferral
        },
        { status: 400 }
      )
    }

    const referral = await db.referral.create({
      data: {
        referrerId: user.id,
        name,
        phoneNumber,
        status: 'PENDING'
      }
    })

    await db.notification.create({
      data: {
        userId: user.id,
        title: 'Referral Submitted',
        message: `You referred ${name}. You'll earn 100 points when they sign up.`,
        type: 'REFERRAL',
        relatedId: referral.id
      }
    })

    return NextResponse.json(referral, { status: 201 })

  } catch (error) {
    console.error('[REFERRAL_POST_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
