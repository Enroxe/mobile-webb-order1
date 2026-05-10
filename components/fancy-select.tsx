'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SelectOption {
  id: number;
  label: string;
  sublabel?: string;
}

interface FancySelectProps {
  value: number | null;
  onValueChange: (value: number) => void;
  options: SelectOption[];
  placeholder: string;
  label: string;
  icon?: React.ReactNode;
  emptyMessage?: string;
}

export function FancySelect({
  value,
  onValueChange,
  options,
  placeholder,
  label,
  icon,
  emptyMessage = 'Нет доступных опций',
}: FancySelectProps) {
  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <div className="space-y-2 relative z-0">
      <div className="flex items-center gap-2">
        {icon}
        <label className="text-sm font-medium">
          {label} *
        </label>
        {options.length > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {options.length}
          </Badge>
        )}
      </div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full h-11 justify-between transition-all duration-200 border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500',
              !selectedOption && 'text-muted-foreground'
            )}
          >
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[var(--radix-dropdown-menu-trigger-width)] z-[100] bg-white shadow-xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200"
          align="start"
          side="bottom"
          sideOffset={4}
          avoidCollisions={true}
          collisionPadding={8}
        >
          <div className="max-h-[250px] overflow-y-auto bg-white">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="bg-white">{label}</DropdownMenuLabel>
              {options.length === 0 ? (
                <div className="px-2 py-6 text-center text-sm text-muted-foreground bg-white">
                  {emptyMessage}
                </div>
              ) : (
                <DropdownMenuRadioGroup
                  value={value?.toString()}
                  onValueChange={(v) => onValueChange(Number(v))}
                >
                  {options.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.id}
                      value={option.id.toString()}
                      className="cursor-pointer bg-white hover:bg-blue-50 transition-colors duration-150"
                    >
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="truncate">{option.label}</span>
                        {option.sublabel && (
                          <span className="text-xs text-muted-foreground truncate">
                            {option.sublabel}
                          </span>
                        )}
                      </div>
                      {value === option.id && (
                        <Check className="ml-2 h-4 w-4 text-blue-600" />
                      )}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              )}
            </DropdownMenuGroup>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
