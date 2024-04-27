import { getCachedUser } from '@/lib/queries/user'
import { SiteFooter } from '@/components/layouts/site-footer'
import { SiteHeader } from '@/components/layouts/site-header'

interface LobyLayoutProps
  extends React.PropsWithChildren<{
    modal: React.ReactNode
  }> {}

export default async function DashboardLayout({ children }: LobyLayoutProps) {
  const user = await getCachedUser()

  return (
    <div className='relative flex min-h-screen flex-col'>
      <SiteHeader user={user} />
      <main className='relative flex h-screen w-full flex-col'>
        <div className='w-full'>{children}</div>
      </main>
      <SiteFooter />
    </div>
  )
}
