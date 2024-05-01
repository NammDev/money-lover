'use server'

import { db } from '../db'
import { CreateTransactionSchema, CreateTransactionSchemaType } from '../schemas/transactions'
import { GetFormatterForCurrency } from '../utils'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function createTransaction(userId: string, form: CreateTransactionSchemaType) {
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

  // NOTE: don't make confusion between $transaction ( db ) and db.transaction (table)

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

export async function getBalanceStats(userId: string, from: Date, to: Date) {
  const totals = await db.transaction.groupBy({
    by: ['type'],
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
  })

  return {
    expense: totals.find((t) => t.type === 'expense')?._sum.amount || 0,
    income: totals.find((t) => t.type === 'income')?._sum.amount || 0,
  }
}

export type GetTransactionHistoryResponseType = Awaited<ReturnType<typeof getTransactionsHistory>>

export async function getTransactionsHistory(from: Date, to: Date) {
  const user = await currentUser()
  if (!user) {
    redirect('/sign-in')
  }

  const userSettings = await db.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  })
  if (!userSettings) {
    throw new Error('user settings not found')
  }

  const formatter = GetFormatterForCurrency(userSettings.currency)

  const transactions = await db.transaction.findMany({
    where: {
      userId: userSettings.userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: 'desc',
    },
  })

  return transactions.map((transaction) => ({
    ...transaction,
    // lets format the amount with the user currency
    formattedAmount: formatter.format(transaction.amount),
  }))
}

export async function DeleteTransaction(id: string) {
  const user = await currentUser()
  if (!user) {
    redirect('/sign-in')
  }

  const transaction = await db.transaction.findUnique({
    where: {
      userId: user.id,
      id,
    },
  })

  if (!transaction) {
    throw new Error('bad request')
  }

  await db.$transaction([
    // Delete transaction from db
    db.transaction.delete({
      where: {
        id,
        userId: user.id,
      },
    }),
    // Update month history
    db.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: transaction.date.getUTCDate(),
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === 'expense' && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === 'income' && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
    // Update year history
    db.yearHistory.update({
      where: {
        month_year_userId: {
          userId: user.id,
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === 'expense' && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === 'income' && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
  ])
}
