import { Icons } from '@/components/app-ui/icons'
import { Shell } from '@/components/app-ui/shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import Link from 'next/link'
import * as React from 'react'

export default function IndexPage() {
  return (
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <Shell className='max-w-6xl'>
        <section className='mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 py-24 text-center md:py-32'>
          <div
            className='flex animate-fade-up flex-col space-y-2'
            style={{ animationDelay: '0.10s', animationFillMode: 'both' }}
          >
            <Link href={siteConfig.links.x} target='_blank' rel='noreferrer'>
              <Badge aria-hidden='true' className='rounded-full px-3.5 py-1.5' variant='secondary'>
                Rewritting with Next.js 14, follow along on X for updates
              </Badge>
              <span className='sr-only'>X</span>
            </Link>
            <Link href={siteConfig.links.github} target='_blank' rel='noreferrer'>
              <Badge aria-hidden='true' className='rounded-full px-3.5 py-1.5' variant='secondary'>
                {/* <Icons.gitHub className='mr-2 size-3.5' aria-hidden='true' /> */}
                4942 stars on GitHub
              </Badge>
              <span className='sr-only'>GitHub</span>
            </Link>
          </div>
          <h1
            className='animate-fade-up text-balance font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl'
            style={{ animationDelay: '0.20s', animationFillMode: 'both' }}
          >
            An e-commerce skateshop built with everything new in Next.js
          </h1>
          <p
            className='max-w-2xl animate-fade-up text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8'
            style={{ animationDelay: '0.30s', animationFillMode: 'both' }}
          >
            Buy and sell skateboarding gears from independent brands and stores around the world
            with ease
          </p>
          <div
            className='flex animate-fade-up flex-wrap items-center justify-center gap-4'
            style={{ animationDelay: '0.40s', animationFillMode: 'both' }}
          >
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
      </Shell>
    </React.Suspense>
  )
}
