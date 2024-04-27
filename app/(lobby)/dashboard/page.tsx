// import CreateTransactionDialog from '@/app/(dashboard)/_components/CreateTransactionDialog'
// import History from '@/app/(dashboard)/_components/History'
// import Overview from '@/app/(dashboard)/_components/Overview'
import { Button } from '@/components/ui/button'
import { getCachedUser } from '@/lib/queries/user'
import { redirect } from 'next/navigation'
import React from 'react'
import { getUserSetting } from '@/lib/actions/user-setting'

async function page() {
  const user = await getCachedUser()
  if (!user) {
    redirect('/signin')
  }

  const userSettings = await getUserSetting(user.id)
  if (!userSettings) {
    redirect('/wizard')
  }

  return (
    <div className='h-full bg-background'>
      <div className='border-b bg-card'>
        <div className='container flex flex-wrap items-center justify-between gap-6 py-8'>
          <p className='text-3xl font-bold'>Hello, {user.firstName}! 👋</p>

          <div className='flex items-center gap-3'>
            <p>New income</p>
            <p>New expense</p>
            {/* <CreateTransactionDialog
              trigger={
                <Button
                  variant={'outline'}
                  className='border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white'
                >
                  New income 🤑
                </Button>
              }
              type='income'
            /> */}

            {/* <CreateTransactionDialog
              trigger={
                <Button
                  variant={'outline'}
                  className='border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white'
                >
                  New expense 😤
                </Button>
              }
              type='expense'
            /> */}
          </div>
        </div>
      </div>
      <h1>Overview</h1>
      <h1>Setting</h1>
      {/* <Overview userSettings={userSettings} />
      <History userSettings={userSettings} /> */}
    </div>
  )
}

export default page
