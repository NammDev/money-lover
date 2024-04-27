import { Currencies, Currency } from '@/config/currencies'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { convertToUppercase } from '@/lib/utils'

export function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void
  setSelectedOption: (currency: Currency | undefined) => void
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
                setSelectedOption(
                  Currencies.find((c) => c.value === convertToUppercase(value)) || undefined
                )
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
