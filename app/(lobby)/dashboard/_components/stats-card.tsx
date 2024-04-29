'use client'

import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/utils'
import { UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import React, { useMemo } from 'react'
import SkeletonWrapper from '@/components/skeletons/wrapper-skeleton'
import { getBalanceStats } from '@/lib/actions/transactions'
import { StatCard } from './stat-card'

interface Props {
  from: Date
  to: Date
  userSettings: UserSettings
}

type GetBalanceStatsResponseType = Awaited<ReturnType<typeof getBalanceStats>>

function StatsCards({ from, to, userSettings }: Props) {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ['overview', 'stats', from, to],
    queryFn: () => getBalanceStats(userSettings.userId, DateToUTCDate(from), DateToUTCDate(to)),
  })

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency)
  }, [userSettings.currency])

  const income = statsQuery.data?.income || 0
  const expense = statsQuery.data?.expense || 0
  const balance = income - expense

  return (
    <div className='relative flex w-full flex-wrap gap-2 md:flex-nowrap'>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title='Income'
          icon={
            <TrendingUp className='h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10' />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title='Expense'
          icon={
            <TrendingDown className='h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10' />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title='Balance'
          icon={
            <Wallet className='h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10' />
          }
        />
      </SkeletonWrapper>
    </div>
  )
}

export default StatsCards
