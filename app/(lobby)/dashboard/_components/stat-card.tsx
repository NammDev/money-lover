import { Card } from '@/components/ui/card'
import { ReactNode, useCallback } from 'react'
import CountUp from 'react-countup'

export function StatCard({
  formatter,
  value,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat
  icon: ReactNode
  title: String
  value: number
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value)
    },
    [formatter]
  )

  return (
    <Card className='flex h-24 w-full items-center gap-2 p-4'>
      {icon}
      <div className='flex flex-col items-start gap-0'>
        <p className='text-muted-foreground'>{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className='text-2xl'
        />
      </div>
    </Card>
  )
}
