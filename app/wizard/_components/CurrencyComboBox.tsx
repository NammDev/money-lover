'use client'

import * as React from 'react'

import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { UserSettings } from '@prisma/client'
import { toast } from 'sonner'
import SkeletonWrapper from '@/components/app-ui/SkeletonWrapper'
import { Currencies, Currency } from '@/config/currencies'
import { showErrorToast } from '@/lib/handle-error'
import { updateUserSetting } from '@/lib/actions/user-setting'
import { useRouter } from 'next/navigation'

type CurrencyComboBoxProps = {
  userId: string
  userSetting: UserSettings
}

export function CurrencyComboBox({ userId, userSetting }: CurrencyComboBoxProps) {
  const router = useRouter()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const userCurrency = Currencies.find((currency) => currency.value === userSetting.currency)

  const selectOption = (currency: Currency | null) => {
    if (!currency) {
      toast.error('Please select a currency')
      return
    }
    toast.loading('Updating currency...')
    startTransition(async () => {
      try {
        await updateUserSetting(userId, currency.value)
        toast.success(`Currency updated successuflly 🎉`)
        router.push(`/dashboard`)
      } catch (err) {
        showErrorToast(err)
      }
    })
  }

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={isPending}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant='outline' className='w-full justify-start' disabled={isPending}>
              {userCurrency ? <>{userCurrency.label}</> : <>Set currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0' align='start'>
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    )
  }

  return (
    <SkeletonWrapper isLoading={isPending}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant='outline' className='w-full justify-start' disabled={isPending}>
            {userCurrency ? <>{userCurrency.label}</> : <>Set currency</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className='mt-4 border-t'>
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  )
}

function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void
  setSelectedOption: (status: Currency | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder='Filter currency...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedOption(Currencies.find((priority) => priority.value === value) || null)
                setOpen(false)
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
