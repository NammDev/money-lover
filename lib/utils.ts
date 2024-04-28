import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { User } from '@clerk/nextjs/server'
import { Currencies } from '@/config/currencies'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

export function getUserEmail(user: User | null) {
  const email =
    user?.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ?? ''

  return email
}

export function convertToUppercase(str: string) {
  return str.toUpperCase()
}

export function DateToUTCDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  )
}

export function GetFormatterForCurrency(currency: string) {
  const locale = Currencies.find((c) => c.value === currency)?.locale

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  })
}
