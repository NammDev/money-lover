import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

import { Icons } from '@/components/app-ui/icons'
import { Shell } from '@/components/app-ui/shell'

export default function SSOCallbackPage() {
  return (
    <Shell className='max-w-lg place-items-center'>
      <Icons.spinner className='size-16 animate-spin' aria-hidden='true' />
      <AuthenticateWithRedirectCallback />
    </Shell>
  )
}
