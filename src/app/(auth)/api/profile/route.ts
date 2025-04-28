import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest } from 'next'

export async function PUT(req: Request) {
  try {
    const { userId: clerkId } = getAuth(req as unknown as NextApiRequest)
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    
    // Update user data
    const updatedUser = await db.user.update({
      where: { clerkId },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        phoneNumber: body.phoneNumber,
        bloodType: body.bloodType,
      },
    })

    // Handle addresses in a transaction
    const result = await db.$transaction(async (tx) => {
      // First, find all addresses that have related requests
      const addressesWithRequests = await tx.address.findMany({
        where: { 
          userId: updatedUser.id,
          Request: { some: {} } // Only addresses with related requests
        },
        include: { Request: true }
      })

      // For each address with requests, either:
      // 1. Delete the related requests first, or
      // 2. Update them to point to a different address
      // Here I'm showing option 1 - deleting the requests
      await Promise.all(
        addressesWithRequests.map(address => 
          tx.request.deleteMany({
            where: { addressId: address.id }
          })
        )
      )

      // Now it's safe to delete all addresses
      await tx.address.deleteMany({
        where: { userId: updatedUser.id }
      })

      // Create new addresses
      const createdAddresses = await Promise.all(
        body.addresses.map((address: any) =>
          tx.address.create({
            data: {
              ...address,
              userId: updatedUser.id,
            }
          })
        )
      )

      return { user: updatedUser, addresses: createdAddresses }
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('[PROFILE_UPDATE_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}