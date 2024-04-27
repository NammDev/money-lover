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
import { useMutation, useQuery } from '@tanstack/react-query'
import { UserSettings } from '@prisma/client'
import { Currencies, Currency } from '@/config/currencies'
import { toast } from 'sonner'
import SkeletonWrapper from '../skeletons/wrapper-skeleton'
import { getCreateUserSetting, updateUserSetting } from '@/lib/actions/user-setting'
import { convertToUppercase } from '@/lib/utils'

type CurrencyComboBoxProps = {
  userId: string
}

export function CurrencyComboBox({ userId }: CurrencyComboBoxProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectedOption, setSelectedOption] = React.useState<Currency | null>(null)

  const userSettings = useQuery<UserSettings>({
    queryKey: ['userSettings'],
    queryFn: () => getCreateUserSetting(userId),
  })

  React.useEffect(() => {
    if (!userSettings.data) return
    const userCurrency = Currencies.find(
      (currency) => currency.value === userSettings.data.currency
    )
    if (userCurrency) setSelectedOption(userCurrency)
  }, [userSettings.data])

  const mutation = useMutation({
    mutationFn: (currencyValue: string) => updateUserSetting(userId, currencyValue),
    onSuccess: (data: UserSettings) => {
      toast.success(`Currency updated successuflly 🎉`)
      setSelectedOption(Currencies.find((c) => c.value === data.currency) || null)
    },
    onError: (e) => {
      console.log(e)
      toast.error('Something went wrong')
    },
  })

  const selectOption = React.useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error('Please select a currency')
        return
      }
      mutation.mutate(currency.value)
    },
    [mutation]
  )

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-full justify-start'
              disabled={mutation.isPending}
            >
              {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
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
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant='outline' className='w-full justify-start' disabled={mutation.isPending}>
            {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
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
                setSelectedOption(Currencies.find((c) => c.value === convertToUppercase(value))!)
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
