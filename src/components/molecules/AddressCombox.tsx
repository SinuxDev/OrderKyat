"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MYANMAR_CITIES } from "@/lib/cities";

interface AddressComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AddressCombobox({
  value,
  onChange,
}: AddressComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const filteredCities = React.useMemo(() => {
    if (!inputValue) return MYANMAR_CITIES;

    return MYANMAR_CITIES.filter((city) =>
      city.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue]);

  const handleSelect = (currentValue: string) => {
    onChange(currentValue);
    setOpen(false);
    setInputValue("");
  };

  const handleInputChange = (search: string) => {
    setInputValue(search);
    if (search) {
      onChange(search);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setInputValue("");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-11 lg:h-12 text-sm lg:text-base bg-slate-50 border-slate-300 hover:bg-slate-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
        >
          <span
            className={cn("truncate text-left", !value && "text-slate-500")}
          >
            {value || "Select or type a city..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search or type city name..."
            value={inputValue}
            onValueChange={handleInputChange}
            className="h-10"
            autoFocus={false}
          />

          <CommandList className="max-h-[400px] overflow-y-auto">
            <CommandEmpty>
              <div className="py-6 text-center text-sm">
                {inputValue ? (
                  <>
                    <p className="text-slate-500 mb-2">
                      Use &quot;{inputValue}&quot; as custom city
                    </p>
                    <p className="text-xs text-slate-400">
                      Click outside to confirm
                    </p>
                  </>
                ) : (
                  <p className="text-slate-500">No cities found</p>
                )}
              </div>
            </CommandEmpty>

            <CommandGroup heading={`Myanmar Cities (${filteredCities.length})`}>
              {filteredCities.map((city) => (
                <CommandItem
                  key={city}
                  value={city}
                  onSelect={handleSelect}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === city ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city}
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Show custom input option if typing something new */}
            {inputValue &&
              !filteredCities.some(
                (city) => city.toLowerCase() === inputValue.toLowerCase()
              ) && (
                <CommandGroup heading="Custom City">
                  <CommandItem
                    value={inputValue}
                    onSelect={() => handleSelect(inputValue)}
                    className="cursor-pointer bg-blue-50 hover:bg-blue-100"
                  >
                    <Check className="mr-2 h-4 w-4 opacity-0" />
                    <span className="font-medium">
                      Use &quot;{inputValue}&quot;
                    </span>
                  </CommandItem>
                </CommandGroup>
              )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
