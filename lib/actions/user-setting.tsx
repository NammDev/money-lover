'use server'

import { db } from '../db'
import { unstable_cache as cache, unstable_noStore as noStore, revalidatePath } from 'next/cache'

export async function getCacheUserSetting(userId: string) {
  return await cache(
    async () => {
      return db.userSettings.findUnique({
        where: {
          userId: userId,
        },
      })
    },
    ['userSettings'],
    {
      revalidate: 60, // every hour
      tags: ['userSettings'],
    }
  )()
}

export async function getUserSetting(userId: string) {
  return db.userSettings.findUnique({
    where: {
      userId: userId,
    },
  })
}

export async function createUserSetting(userId: string) {
  return db.userSettings.create({
    data: {
      userId: userId,
      currency: 'USD',
    },
  })
}

export async function getCreateUserSetting(userId: string) {
  const userSetting = await getUserSetting(userId)
  if (!userSetting) {
    return await createUserSetting(userId)
  } else {
    return userSetting
  }
}

export async function updateUserSetting(userId: string, currency: string) {
  return await db.userSettings.update({
    where: {
      userId: userId,
    },
    data: {
      currency,
    },
  })
}
