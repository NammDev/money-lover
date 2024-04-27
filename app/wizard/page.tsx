import Logo from '@/components/app-ui/logo-piggy'
import { getCreateUserSetting, updateUserSetting } from '@/lib/actions/user-setting'
import { getCachedUser } from '@/lib/queries/user'
import { redirect } from 'next/navigation'
import React from 'react'
import { CurrencyComboBox } from './_components/currency-combobox'
import { toast } from 'sonner'
import { showErrorToast } from '@/lib/handle-error'

async function page() {
  const user = await getCachedUser()
  if (!user) {
    redirect('/signin')
  }

  const userSetting = await getCreateUserSetting(user.id)

  async function onSubmitCurrency(userId: string, currencyValue: string) {
    'use server'
    try {
      await updateUserSetting(userId, currencyValue)
      // toast.success(`Currency updated successuflly 🎉`)
      redirect(`/dashboard`)
    } catch (err) {
      showErrorToast(err)
    }
  }

  return (
    <div className='container flex max-w-2xl flex-col items-center justify-between gap-4'>
      <div>
        <h1 className='text-center text-3xl'>
          Welcome, <span className='ml-2 font-bold'>{user.firstName}! 👋</span>
        </h1>
        <h2 className='mt-4 text-center text-base text-muted-foreground'>
          Let &apos;s get started by setting up your currency
        </h2>

        <h3 className='mt-2 text-center text-sm text-muted-foreground'>
          You can change these settings at any time
        </h3>
      </div>
      <CurrencyComboBox onSubmit={onSubmitCurrency} userId={user.id} userSetting={userSetting} />
      <div className='mt-8'>
        <Logo />
      </div>
    </div>
  )
}

export default page
