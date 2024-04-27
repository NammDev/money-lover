import { getCachedUser } from '@/lib/queries/user'
import { CurrencyComboBox } from './currency-combobox'
import { redirect } from 'next/navigation'
import { getCreateUserSetting, updateUserSetting } from '@/lib/actions/user-setting'
import { showErrorToast } from '@/lib/handle-error'

export async function ServerCurrencyComboBox() {
  const user = await getCachedUser()
  if (!user) {
    redirect('/signin')
  }

  const userSetting = await getCreateUserSetting(user.id)

  async function onSubmitCurrency(userId: string, currencyValue: string) {
    'use server'
    try {
      await updateUserSetting(userId, currencyValue)
    } catch (err) {
      showErrorToast(err)
    }
  }
  return <CurrencyComboBox onSubmit={onSubmitCurrency} userId={user.id} userSetting={userSetting} />
}
