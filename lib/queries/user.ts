import 'server-only'

import { cache } from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { currentUser } from '@clerk/nextjs/server'

export const getCachedUser = cache(async () => {
  noStore()
  try {
    return await currentUser()
  } catch (err) {
    console.error(err)
    return null
  }
})
