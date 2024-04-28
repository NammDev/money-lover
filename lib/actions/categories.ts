'use server'

import { TransactionType } from '@/types'
import { db } from '../db'

export async function getCategoriesByType(userId: string, type: TransactionType) {
  return db.category.findMany({
    where: {
      userId: userId,
      ...(type && { type }), // include type in the filters if it's defined
    },
    orderBy: {
      name: 'asc',
    },
  })
}
