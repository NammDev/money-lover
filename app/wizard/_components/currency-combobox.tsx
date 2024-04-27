'use client'

import * as React from 'react'

import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { UserSettings } from '@prisma/client'
import { Currencies, Currency } from '@/config/currencies'
import { OptionList } from './option-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { toast } from 'sonner'

type CurrencyComboBoxProps = {
  userId: string
  userSetting: UserSettings
  onSubmit: (userId: string, currencyValue: string) => Promise<void>
}

export function CurrencyComboBox({ userId, onSubmit, userSetting }: CurrencyComboBoxProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [open, setOpen] = React.useState(false)

  const userCurrency = Currencies.find(
    (currency) => currency.value === userSetting.currency
  ) as Currency
  const [selectedOption, setSelectedOption] = React.useState<Currency>(userCurrency)

  if (isDesktop) {
    return (
      <>
        <Separator />
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>Set your default currency for transactions</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
        <Separator />
        <Button className='w-full' asChild>
          <Link
            onClick={() => {
              onSubmit(userId, selectedOption?.value)
              toast.success(`Currency updated successuflly 🎉`)
            }}
            href={'/dashboard'}
          >
            I&apos;m done! Take me to the dashboard
          </Link>
        </Button>
      </>
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
