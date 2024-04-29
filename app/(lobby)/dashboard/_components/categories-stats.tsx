'use client'

import SkeletonWrapper from '@/components/skeletons/wrapper-skeleton'
import { GetCategoriesStatsResponseType, getCategoriesStats } from '@/lib/actions/categories'
import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/utils'
import { UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { CategoriesCard } from './categories-card'

interface Props {
  userSettings: UserSettings
  from: Date
  to: Date
}

function CategoriesStats({ userSettings, from, to }: Props) {
  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ['overview', 'stats', 'categories', from, to],
    queryFn: () => getCategoriesStats(userSettings.userId, DateToUTCDate(from), DateToUTCDate(to)),
  })

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency)
  }, [userSettings.currency])

  return (
    <div className='flex w-full flex-wrap gap-2 md:flex-nowrap'>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard formatter={formatter} type='income' data={statsQuery.data || []} />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard formatter={formatter} type='expense' data={statsQuery.data || []} />
      </SkeletonWrapper>
    </div>
  )
}

export default CategoriesStats
