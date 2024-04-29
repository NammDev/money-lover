'use server'

import { getDaysInMonth } from 'date-fns'
import { Period, Timeframe } from '@/types'
import { db } from '../db'

export async function getHistoryData(userId: string, timeframe: Timeframe, period: Period) {
  switch (timeframe) {
    case 'year':
      return await getYearHistoryData(userId, period.year)
    case 'month':
      return await getMonthHistoryData(userId, period.year, period.month)
  }
}

export type GetHistoryDataResponseType = Awaited<ReturnType<typeof getHistoryData>>

type HistoryData = {
  expense: number
  income: number
  year: number
  month: number
  day?: number
}

async function getYearHistoryData(userId: string, year: number) {
  const result = await db.yearHistory.groupBy({
    by: ['month'],
    where: {
      userId,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        month: 'asc',
      },
    ],
  })

  if (!result || result.length === 0) return []

  const history: HistoryData[] = []

  for (let i = 0; i < 12; i++) {
    let expense = 0
    let income = 0

    const month = result.find((row) => row.month === i)
    if (month) {
      expense = month._sum.expense || 0
      income = month._sum.income || 0
    }

    history.push({
      year,
      month: i,
      expense,
      income,
    })
  }

  return history
}

async function getMonthHistoryData(userId: string, year: number, month: number) {
  const result = await db.monthHistory.groupBy({
    by: ['day'],
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        day: 'asc',
      },
    ],
  })

  if (!result || result.length === 0) return []

  const history: HistoryData[] = []
  const daysInMonth = getDaysInMonth(new Date(year, month))
  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0
    let income = 0

    const day = result.find((row) => row.day === i)
    if (day) {
      expense = day._sum.expense || 0
      income = day._sum.income || 0
    }

    history.push({
      expense,
      income,
      year,
      month,
      day: i,
    })
  }

  return history
}

export type GetHistoryPeriodsResponseType = Awaited<ReturnType<typeof getHistoryPeriods>>

export async function getHistoryPeriods(userId: string) {
  const result = await db.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ['year'],
    orderBy: [
      {
        year: 'asc',
      },
    ],
  })

  const years = result.map((el) => el.year)
  if (years.length === 0) {
    // Return the current year
    return [new Date().getFullYear()]
  }

  return years
}
