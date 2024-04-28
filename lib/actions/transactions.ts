'use server'

import { db } from '../db'
import { CreateTransactionSchema, CreateTransactionSchemaType } from '../schemas/transactions'

export async function CreateTransaction(userId: string, form: CreateTransactionSchemaType) {
  const parsedBody = CreateTransactionSchema.safeParse(form)
  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message)
  }

  const { amount, category, date, description, type } = parsedBody.data
  const categoryRow = await db.category.findFirst({
    where: {
      userId: userId,
      name: category,
    },
  })

  if (!categoryRow) {
    throw new Error('category not found')
  }

  // NOTE: don't make confusion between $transaction ( prisma ) and prisma.transaction (table)

  await db.$transaction([
    // Create user transaction
    db.transaction.create({
      data: {
        userId: userId,
        amount,
        date,
        description: description || '',
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),

    // Update month aggregate table
    db.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: userId,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: userId,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === 'expense' ? amount : 0,
        income: type === 'income' ? amount : 0,
      },
      update: {
        expense: {
          increment: type === 'expense' ? amount : 0,
        },
        income: {
          increment: type === 'income' ? amount : 0,
        },
      },
    }),

    // Update year aggreate
    db.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: userId,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: userId,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === 'expense' ? amount : 0,
        income: type === 'income' ? amount : 0,
      },
      update: {
        expense: {
          increment: type === 'expense' ? amount : 0,
        },
        income: {
          increment: type === 'income' ? amount : 0,
        },
      },
    }),
  ])
}
