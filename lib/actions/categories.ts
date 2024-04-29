'use server'

import { TransactionType } from '@/types'
import { db } from '../db'
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from '../schemas/categories'

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

export async function getCategoriesStats(userId: string, from: Date, to: Date) {
  return await db.transaction.groupBy({
    by: ['type', 'category', 'categoryIcon'],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: 'desc',
      },
    },
  })
}

export type GetCategoriesStatsResponseType = Awaited<ReturnType<typeof getCategoriesStats>>

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

export async function deleteCategory(userId: string, form: DeleteCategorySchemaType) {
  const parsedBody = DeleteCategorySchema.safeParse(form)
  if (!parsedBody.success) {
    throw new Error('bad request')
  }

  return await db.category.delete({
    where: {
      name_userId_type: {
        userId: userId,
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  })
}
