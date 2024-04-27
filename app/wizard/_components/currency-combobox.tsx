'use client'

import * as React from 'react'

import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { UserSettings } from '@prisma/client'
import { Currencies, Currency } from '@/config/currencies'
import { useRouter } from 'next/navigation'
import { OptionList } from './option-list'

type CurrencyComboBoxProps = {
  userId: string
  userSetting: UserSettings
}

export function CurrencyComboBox({ userId, userSetting }: CurrencyComboBoxProps) {
  const router = useRouter()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [open, setOpen] = React.useState(false)

  const userCurrency = Currencies.find((currency) => currency.value === userSetting.currency)
  const [selectedOption, setSelectedOption] = React.useState<Currency | undefined>(userCurrency)

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' className='w-full justify-start'>
            {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0' align='start'>
          <OptionList setOpen={setOpen} setSelectedOption={setSelectedOption} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='outline' className='w-full justify-start'>
          {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='mt-4 border-t'>
          <OptionList setOpen={setOpen} setSelectedOption={setSelectedOption} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
