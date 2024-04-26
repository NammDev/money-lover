import { db } from '../db'

export async function getUserSetting(userId: string) {
  return db.userSettings.findUnique({
    where: {
      userId: userId,
    },
  })
}
