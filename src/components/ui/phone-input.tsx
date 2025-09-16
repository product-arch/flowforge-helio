import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface Country {
  name: string
  code: string
  dialCode: string
  flag: string
}

const countries: Country[] = [
  { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦" },
  { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪" },
  { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { name: "Italy", code: "IT", dialCode: "+39", flag: "🇮🇹" },
  { name: "Spain", code: "ES", dialCode: "+34", flag: "🇪🇸" },
  { name: "Netherlands", code: "NL", dialCode: "+31", flag: "🇳🇱" },
  { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
  { name: "China", code: "CN", dialCode: "+86", flag: "🇨🇳" },
  { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵" },
  { name: "South Korea", code: "KR", dialCode: "+82", flag: "🇰🇷" },
  { name: "Brazil", code: "BR", dialCode: "+55", flag: "🇧🇷" },
  { name: "Mexico", code: "MX", dialCode: "+52", flag: "🇲🇽" },
  { name: "Russia", code: "RU", dialCode: "+7", flag: "🇷🇺" },
  { name: "Singapore", code: "SG", dialCode: "+65", flag: "🇸🇬" },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971", flag: "🇦🇪" },
  { name: "South Africa", code: "ZA", dialCode: "+27", flag: "🇿🇦" },
  { name: "Nigeria", code: "NG", dialCode: "+234", flag: "🇳🇬" },
]

const phoneValidationPatterns: Record<string, RegExp> = {
  "+1": /^[2-9]\d{2}[2-9]\d{6}$/, // US/Canada: 10 digits
  "+44": /^[1-9]\d{8,9}$/, // UK: 9-10 digits
  "+61": /^[2-4689]\d{8}$/, // Australia: 9 digits
  "+49": /^[1-9]\d{6,11}$/, // Germany: 7-12 digits
  "+33": /^[1-9]\d{8}$/, // France: 9 digits
  "+39": /^[3]\d{8,9}$/, // Italy: 9-10 digits
  "+34": /^[6-9]\d{8}$/, // Spain: 9 digits
  "+31": /^[1-9]\d{8}$/, // Netherlands: 9 digits
  "+91": /^[6-9]\d{9}$/, // India: 10 digits
  "+86": /^1[3-9]\d{9}$/, // China: 11 digits
  "+81": /^[7-9]\d{9}$/, // Japan: 10 digits
  "+82": /^1[0-9]\d{7,8}$/, // South Korea: 9-10 digits
  "+55": /^[1-9]\d{8,10}$/, // Brazil: 9-11 digits
  "+52": /^[1-9]\d{9}$/, // Mexico: 10 digits
  "+7": /^[49]\d{9}$/, // Russia: 10 digits
  "+65": /^[8-9]\d{7}$/, // Singapore: 8 digits
  "+971": /^[2-9]\d{7,8}$/, // UAE: 8-9 digits
  "+27": /^[1-9]\d{8}$/, // South Africa: 9 digits
  "+234": /^[7-9]\d{9}$/, // Nigeria: 10 digits
}

export interface PhoneInputProps {
  value?: string
  onChange?: (value: string, isValid: boolean) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  defaultCountry?: string
}

export const PhoneInput = React.forwardRef<
  HTMLInputElement,
  PhoneInputProps
>(({ value = "", onChange, placeholder, className, disabled, defaultCountry = "US" }, ref) => {
  const [open, setOpen] = React.useState(false)
  const [selectedCountry, setSelectedCountry] = React.useState<Country>(
    countries.find(c => c.code === defaultCountry) || countries[0]
  )
  const [phoneNumber, setPhoneNumber] = React.useState("")

  // Parse existing value on mount
  React.useEffect(() => {
    if (value) {
      const country = countries.find(c => value.startsWith(c.dialCode))
      if (country) {
        setSelectedCountry(country)
        setPhoneNumber(value.slice(country.dialCode.length))
      } else {
        setPhoneNumber(value)
      }
    }
  }, [value])

  const validatePhoneNumber = (countryCode: string, number: string): boolean => {
    if (!number) return false
    const pattern = phoneValidationPatterns[countryCode]
    return pattern ? pattern.test(number) : number.length >= 7
  }

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setOpen(false)
    
    const fullNumber = phoneNumber ? `${country.dialCode}${phoneNumber}` : country.dialCode
    const isValid = validatePhoneNumber(country.dialCode, phoneNumber)
    onChange?.(fullNumber, isValid)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value.replace(/\D/g, '') // Only digits
    setPhoneNumber(newNumber)
    
    const fullNumber = newNumber ? `${selectedCountry.dialCode}${newNumber}` : selectedCountry.dialCode
    const isValid = validatePhoneNumber(selectedCountry.dialCode, newNumber)
    onChange?.(fullNumber, isValid)
  }

  return (
    <div className={cn("flex", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[140px] justify-between rounded-r-none border-r-0"
            disabled={disabled}
          >
            <span className="flex items-center gap-2">
              <span>{selectedCountry.flag}</span>
              <span>{selectedCountry.dialCode}</span>
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search countries..." />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {countries.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={`${country.name} ${country.dialCode}`}
                    onSelect={() => handleCountrySelect(country)}
                  >
                    <span className="flex items-center gap-3">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                      <span className="text-muted-foreground">{country.dialCode}</span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      <Input
        ref={ref}
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder={placeholder || "Phone number"}
        className="rounded-l-none"
        disabled={disabled}
      />
    </div>
  )
})

PhoneInput.displayName = "PhoneInput"