import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { User } from '@prisma/client';
import { db } from '@/lib/db';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Missing SIGNING_SECRET in environment variables.');
  }

  const wh = new Webhook(SIGNING_SECRET);
  const headerPayload = headers();

  const svix_id = (await headerPayload).get('svix-id');
  const svix_timestamp = (await headerPayload).get('svix-timestamp');
  const svix_signature = (await headerPayload).get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing Svix headers', { status: 400 });
  }

  const payloadString = await req.text();
  const payload = JSON.parse(payloadString);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payloadString, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  const data = payload.data;

  if (evt.type === 'user.created' || evt.type === 'user.updated') {
    const email = data.email_addresses?.[0]?.email_address;
    const fallbackRole = 'USER';

    if (!email) {
      console.error('Missing email in webhook payload.');
      return new Response('Missing email', { status: 400 });
    }

   
    let dbUser = await db.user.findUnique({
      where: { email },
    });

    const roleToSet = dbUser?.role || fallbackRole;

    const userPayload: Partial<User> = {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email,
      profileImageUrl: data.image_url || null,
      phoneNumber: data.phone_numbers?.[0]?.phone_number,
      clerkId: data.id,
      role: roleToSet,
    };

 
    dbUser = await db.user.upsert({
      where: { email },
      update: {
        firstName: userPayload.firstName,
        lastName: userPayload.lastName,
        profileImageUrl: userPayload.profileImageUrl,
        phoneNumber: userPayload.phoneNumber,
        role: roleToSet,
        clerkId: userPayload.clerkId,
      },
      create: {
        id: userPayload.id!,
        firstName: userPayload.firstName!,
        lastName: userPayload.lastName!,
        profileImageUrl: userPayload.profileImageUrl || null,
        phoneNumber: userPayload.phoneNumber!,
        email: userPayload.email!,
        role: roleToSet,
        clerkId: userPayload.clerkId!,
      },
    });

   
    const client = await clerkClient();
    await client.users.updateUserMetadata(data.id, {
      privateMetadata: {
        role: dbUser.role,
      },
    });

    console.log(`User ${email} synced with role: ${dbUser.role}`);
  }

  if (evt.type === 'user.deleted') {
    const userId = data.id;

    // Clerk sends its own user id; remove by clerkId and make it idempotent.
    await db.user.deleteMany({
      where: { clerkId: userId },
    });

    console.log(`User deleted from DB: ${userId}`);
  }

  return new Response('', { status: 200 });
}
