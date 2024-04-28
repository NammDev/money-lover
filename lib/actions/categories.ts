'use server'

import { TransactionType } from '@/types'
import { db } from '../db'
import { CreateCategorySchema, CreateCategorySchemaType } from '../schemas/categories'

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

export async function createCategory(userId: string, form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form)
  if (!parsedBody.success) {
    throw new Error('bad request')
  }

  const { name, icon, type } = parsedBody.data
  return await db.category.create({
    data: {
      userId: userId,
      name,
      icon,
      type,
    },
  })
}
