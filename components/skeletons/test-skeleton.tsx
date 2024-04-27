import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Shell } from '@/components/app-ui/shell'

export function LobbySkeleton() {
  return (
    <Shell className='max-w-6xl'>
      <section className='mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 py-24 text-center md:py-32'>
        <Skeleton className='h-7 w-44' />
        <Skeleton className='h-7 w-44' />
        <h1 className='text-balance font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl'>
          An e-commerce skateshop built with everything new in Next.js
        </h1>
        <p className='max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8'>
          Buy and sell skateboarding gears from independent brands and stores around the world with
          ease
        </p>
        <div className='flex flex-wrap items-center justify-center gap-4'>
          <Button asChild>
            <Link href='/products'>
              Buy now
              <span className='sr-only'>Buy now</span>
            </Link>
          </Button>
          <Button variant='outline' asChild>
            <Link href='/dashboard/stores'>
              Sell now
              <span className='sr-only'>Sell now</span>
            </Link>
          </Button>
        </div>
      </section>
      <section className='grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'></section>
    </Shell>
  )
}
